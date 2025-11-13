import { Occurrence, OccurrenceStatus, OccurrenceType } from '../types';
import { REPORT_COLUMNS } from '../constants';

declare global {
    interface Window {
        jspdf: any;
        XLSX: any;
    }
}

// Helper function to format date strings
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        // Add timezone to prevent date from shifting
        const utcDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
        return new Intl.DateTimeFormat('pt-BR').format(utcDate);
    } catch (e) {
        return dateString;
    }
};

const getNestedProperty = (obj: any, path: string): string => {
    const value = path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
    if (path === 'occurrenceDate' || path === 'student.birthDate' || path === 'fillingDate') {
        return formatDate(value);
    }
    if (path === 'occurrenceTypes') {
        return Array.isArray(value) ? value.join(', ') : '';
    }
    return value ?? '';
};

// Generates a LIST of occurrences in a table format
export const generatePdfReport = (occurrences: Occurrence[], columnKeys: string[], groupBy: string): void => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: columnKeys.length > 6 ? 'landscape' : 'portrait',
    });

    const selectedColumns = REPORT_COLUMNS.filter(c => columnKeys.includes(c.key));
    const tableHeaders = selectedColumns.map(c => c.label);

    doc.setFontSize(18);
    doc.setTextColor(34, 139, 34);
    doc.text('Relatório de Ocorrências Escolares', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
    
    let startY = 40;

    const generateTableForData = (data: Occurrence[]) => {
        const tableRows = data.map(occ => 
            selectedColumns.map(col => getNestedProperty(occ, col.key))
        );

        doc.autoTable({
            head: [tableHeaders],
            body: tableRows,
            startY,
            theme: 'grid',
            headStyles: { fillColor: [34, 139, 34] },
            styles: { fontSize: 8, cellPadding: 1.5 },
            didDrawPage: (data: any) => {
                // We'll add footers after all tables are drawn
            },
        });
        startY = (doc as any).lastAutoTable.finalY + 10;
    };

    if (groupBy && groupBy !== 'none') {
        const groupedData: Record<string, Occurrence[]> = {};
        occurrences.forEach(occ => {
            let key = '';
            if (groupBy === 'occurrenceDate') key = formatDate(occ.occurrenceDate);
            else if (groupBy === 'mainType') key = occ.occurrenceTypes[0] || 'Não especificado';
            else key = getNestedProperty(occ, groupBy);
            
            if (!groupedData[key]) {
                groupedData[key] = [];
            }
            groupedData[key].push(occ);
        });

        const groupingLabel = groupBy === 'status' ? 'Status' : groupBy === 'occurrenceDate' ? 'Data' : 'Tipo Principal';

        for (const groupName in groupedData) {
            if (startY > 250) {
              doc.addPage();
              startY = 20;
            }
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(22, 101, 52);
            doc.text(`${groupingLabel}: ${groupName}`, 14, startY);
            startY += 6;
            generateTableForData(groupedData[groupName]);
        }
    } else {
        generateTableForData(occurrences);
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save('relatorio_ocorrencias.pdf');
};


// Generates an Excel sheet with detailed data for multiple occurrences
export const generateExcelReport = (occurrences: Occurrence[], columnKeys: string[], groupBy: string): void => {
    const selectedColumns = REPORT_COLUMNS.filter(c => columnKeys.includes(c.key));

    const workbook = window.XLSX.utils.book_new();

    const generateSheetForData = (data: Occurrence[], sheetName: string) => {
        const dataToExport = data.map(occ => {
            const row: Record<string, string> = {};
            selectedColumns.forEach(col => {
                row[col.label] = getNestedProperty(occ, col.key);
            });
            return row;
        });

        if (dataToExport.length === 0) return;

        const worksheet = window.XLSX.utils.json_to_sheet(dataToExport);
        worksheet["!cols"] = selectedColumns.map(c => ({ wch: Math.max(c.label.length, 25) }));
        window.XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    };

    if (groupBy && groupBy !== 'none') {
        const groupedData: Record<string, Occurrence[]> = {};
         occurrences.forEach(occ => {
            let key = '';
            if (groupBy === 'occurrenceDate') key = formatDate(occ.occurrenceDate);
            else if (groupBy === 'mainType') key = occ.occurrenceTypes[0] || 'Não especificado';
            else key = getNestedProperty(occ, groupBy);
            
            if (!groupedData[key]) {
                groupedData[key] = [];
            }
            groupedData[key].push(occ);
        });

        for (const groupName in groupedData) {
            // Sanitize sheet name for Excel
            const safeSheetName = groupName.replace(/[:\\/?*[\]]/g, '').substring(0, 31);
            generateSheetForData(groupedData[groupName], safeSheetName);
        }
    } else {
        generateSheetForData(occurrences, 'Ocorrências');
    }
    
    window.XLSX.writeFile(workbook, 'relatorio_ocorrencias.xlsx');
};

const validateOccurrenceForPdf = (occ: Occurrence): string[] => {
    const missingFields: string[] = [];

    // Helper to check nested properties
    const getProperty = (obj: any, path: string) => path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);

    const requiredFields: { path: string; label: string }[] = [
        { path: 'schoolUnit', label: 'Unidade Escolar' },
        { path: 'student.fullName', label: 'Nome do Aluno' },
        { path: 'student.birthDate', label: 'Data de Nascimento do Aluno' },
        { path: 'student.grade', label: 'Ano/Série' },
        { path: 'student.shift', label: 'Turno' },
        { path: 'guardian.fullName', label: 'Nome do Responsável' },
        { path: 'guardian.phone', label: 'Telefone do Responsável' },
        { path: 'occurrenceDate', label: 'Data da Ocorrência' },
        { path: 'occurrenceTime', label: 'Horário da Ocorrência' },
        { path: 'location', label: 'Local da Ocorrência' },
        { path: 'detailedDescription', label: 'Descrição Detalhada do Fato' },
        { path: 'involvedPeople', label: 'Pessoas Envolvidas' },
        { path: 'immediateActions', label: 'Providências Imediatas' },
    ];

    requiredFields.forEach(field => {
        const value = getProperty(occ, field.path);
        if (!value || (typeof value === 'string' && !value.trim())) {
            missingFields.push(field.label);
        }
    });

    if (occ.occurrenceTypes.length === 0) {
        missingFields.push('Tipo de Ocorrência');
    }

    if (occ.occurrenceTypes.includes(OccurrenceType.OTHER) && !occ.otherOccurrenceType?.trim()) {
        missingFields.push("Especificação para 'Outros'");
    }

    return missingFields;
};


// --- Generates a SINGLE occurrence PDF, formatted like the official form ---
export const generateSingleOccurrencePdf = (occ: Occurrence): string | void => {
    const missingFields = validateOccurrenceForPdf(occ);
    if (missingFields.length > 0) {
        return `Não é possível gerar a ficha. Preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}.`;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const MARGIN = 15;
    const WIDTH = doc.internal.pageSize.getWidth();
    const FONT_SIZE_L = 10;
    const FONT_SIZE_M = 9;
    const FONT_SIZE_S = 8;
    const LINE_HEIGHT = 5;

    let y = MARGIN;

    const drawSectionHeader = (title: string) => {
        doc.setFillColor(220, 252, 231); // lime-100
        doc.rect(MARGIN, y, WIDTH - MARGIN * 2, 8, 'F');
        doc.setFontSize(FONT_SIZE_L);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(22, 101, 52); // lime-800
        doc.text(title, MARGIN + 2, y + 5.5);
        y += 12;
    };
    
    const drawField = (label: string, value: unknown, x: number, width: number, isMultiLine = false, height?: number) => {
        doc.setFontSize(FONT_SIZE_S);
        doc.setTextColor(100);
        doc.text(label, x, y - 1);
        doc.setDrawColor(200);
        const rectHeight = isMultiLine ? (height || 20) : 7;
        doc.rect(x, y, width, rectHeight);

        const stringValue = String(value || '').trim();
        
        if (!stringValue) {
            doc.setFontSize(FONT_SIZE_M);
            doc.setTextColor(150, 150, 150); // Gray color for placeholder
            doc.text('[Não preenchido]', x + 2, y + 4.5);
        } else {
            doc.setFontSize(FONT_SIZE_M);
            doc.setTextColor(0);
            if (isMultiLine) {
                const textLines = doc.splitTextToSize(stringValue, width - 4);
                doc.text(textLines, x + 2, y + 4);
            } else {
                doc.text(stringValue, x + 2, y + 4.5);
            }
        }
    };
    
    const drawCheckbox = (label: string, isChecked: boolean) => {
         doc.setFontSize(FONT_SIZE_M);
         doc.setTextColor(0);
         const text = `(${isChecked ? 'X' : ' '}) ${label}`;
         doc.text(text, MARGIN, y);
         y += LINE_HEIGHT;
    }

    // --- PDF CONTENT ---
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA DE REGISTRO DE OCORRÊNCIA ESCOLAR', WIDTH / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Registro de Situações Críticas', WIDTH / 2, y, { align: 'center' });
    y += 10;

    drawField('Unidade Escolar:', occ.schoolUnit, MARGIN, WIDTH - MARGIN * 2);
    y += 10;
    drawField('Município:', occ.municipality, MARGIN, 110);
    drawField('UF:', occ.uf, MARGIN + 120, 20);
    y += 10;
    drawField('Data de Preenchimento:', formatDate(occ.fillingDate), MARGIN, 80);
    drawField('Horário:', occ.fillingTime, MARGIN + 90, 50);
    y += 10;

    drawSectionHeader('1. IDENTIFICAÇÃO DO ALUNO ENVOLVIDO');
    drawField('Nome completo:', occ.student.fullName, MARGIN, WIDTH - MARGIN * 2);
    y += 10;
    drawField('Data de nascimento:', formatDate(occ.student.birthDate), MARGIN, 60);
    drawField('Idade:', `${occ.student.age || ''} anos`, MARGIN + 70, 40);
    drawField('Ano/Série:', occ.student.grade, MARGIN + 120, 60);
    y += 10;
    drawField('Turno:', occ.student.shift, MARGIN, 80);
    drawField('Nº de matrícula:', occ.student.enrollmentId, MARGIN + 90, 90);
    y += 10;

    drawSectionHeader('2. RESPONSÁVEL LEGAL');
    drawField('Nome completo:', occ.guardian.fullName, MARGIN, 120);
    drawField('Parentesco:', occ.guardian.relationship, MARGIN + 130, 50);
    y += 10;
    drawField('Contato telefônico:', occ.guardian.phone, MARGIN, 80);
    y += 10;
    drawField('Endereço completo:', occ.guardian.address, MARGIN, WIDTH - MARGIN * 2);
    y += 10;
    
    drawSectionHeader('3. CARACTERIZAÇÃO DA OCORRÊNCIA');
    drawField('Data da ocorrência:', formatDate(occ.occurrenceDate), MARGIN, 60);
    drawField('Horário aproximado:', occ.occurrenceTime, MARGIN + 70, 50);
    y += 10;
    drawField('Local onde ocorreu:', occ.location, MARGIN, WIDTH - MARGIN * 2);
    y += 10;
    
    doc.setFontSize(FONT_SIZE_M);
    doc.setFont('helvetica', 'bold');
    doc.text('Tipo de ocorrência:', MARGIN, y);
    y += LINE_HEIGHT;
    Object.values(OccurrenceType).forEach(type => {
        if(y > 260) { doc.addPage(); y = MARGIN; }
        drawCheckbox(type, occ.occurrenceTypes.includes(type));
    });
    if (occ.occurrenceTypes.includes(OccurrenceType.OTHER) && occ.otherOccurrenceType) {
        doc.text(`   Outros: ${occ.otherOccurrenceType}`, MARGIN, y);
        y += LINE_HEIGHT;
    }
    y += 5;

    const drawTextAreaSection = (header: string, content: string, height: number) => {
        if (y + height + 12 > 280) { doc.addPage(); y = MARGIN; }
        drawSectionHeader(header);
        drawField('', content, MARGIN, WIDTH - MARGIN * 2, true, height);
        y += height + 5;
    }
    
    drawTextAreaSection('4. DESCRIÇÃO DETALHADA DO FATO', occ.detailedDescription, 30);
    drawTextAreaSection('5. PESSOAS ENVOLVIDAS', occ.involvedPeople, 20);
    drawTextAreaSection('6. PROVIDÊNCIAS IMEDIATAS ADOTADAS', occ.immediateActions, 20);
    drawTextAreaSection('7. ENCAMINHAMENTOS REALIZADOS', occ.referrals, 20);
    drawTextAreaSection('8. AVALIAÇÃO E OBSERVAÇÕES DO SERVIÇO SOCIAL (se houver)', occ.socialServiceEvaluation || '', 20);
    
    // Signature section
    if (y > 240) { doc.addPage(); y = MARGIN; }
    drawSectionHeader('9. ASSINATURA');
    doc.line(MARGIN, y, MARGIN + 80, y);
    doc.text('Responsável pelo registro', MARGIN, y + 4);
    doc.line(WIDTH - MARGIN - 80, y, WIDTH - MARGIN, y);
    doc.text('Assinatura do responsável legal do aluno', WIDTH - MARGIN - 80, y + 4);
    y += 20;
    doc.line(MARGIN, y, MARGIN + 80, y);
    doc.text('Assinatura da(o) Assistente Social', MARGIN, y + 4);

    doc.save(`ficha_ocorrencia_${occ.student.fullName.replace(/ /g, '_')}_${occ.id}.pdf`);
};