import { Occurrence, OccurrenceStatus, OccurrenceType } from '../types';

declare global {
    interface Window {
        jspdf: any;
        XLSX: any;
    }
}

// Helper function to format date strings
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Add timezone to prevent date from shifting
    const utcDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    return new Intl.DateTimeFormat('pt-BR').format(utcDate);
};

// Generates a LIST of occurrences in a table format
export const generatePdfReport = (occurrences: Occurrence[]): void => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(34, 139, 34);
    doc.text('Relatório de Ocorrências Escolares', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

    const tableColumn = ["ID", "Aluno", "Unidade Escolar", "Data Ocorr.", "Tipo Principal", "Status"];
    const tableRows: any[][] = [];

    occurrences.forEach(occ => {
        const occurrenceData = [
            occ.id.substring(4, 10),
            occ.student.fullName,
            occ.schoolUnit,
            formatDate(occ.occurrenceDate),
            occ.occurrenceTypes[0] || 'N/A',
            occ.status,
        ];
        tableRows.push(occurrenceData);
    });
    
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [34, 139, 34] },
        styles: { fontSize: 8 },
    });
    
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
    }

    doc.save('relatorio_lista_ocorrencias.pdf');
};

// Generates an Excel sheet with detailed data for multiple occurrences
export const generateExcelReport = (occurrences: Occurrence[]): void => {
    const dataToExport = occurrences.map(occ => ({
        'ID': occ.id,
        'Status': occ.status,
        'Unidade Escolar': occ.schoolUnit,
        'Município': occ.municipality,
        'UF': occ.uf,
        'Data Preenchimento': formatDate(occ.fillingDate),
        'Hora Preenchimento': occ.fillingTime,
        'Aluno': occ.student.fullName,
        'Data Nasc. Aluno': formatDate(occ.student.birthDate),
        'Idade Aluno': occ.student.age,
        'Ano/Série': occ.student.grade,
        'Turno': occ.student.shift,
        'Matrícula': occ.student.enrollmentId,
        'Responsável': occ.guardian.fullName,
        'Parentesco': occ.guardian.relationship,
        'Telefone Resp.': occ.guardian.phone,
        'Endereço Resp.': occ.guardian.address,
        'Data Ocorrência': formatDate(occ.occurrenceDate),
        'Hora Ocorrência': occ.occurrenceTime,
        'Local': occ.location,
        'Tipos de Ocorrência': occ.occurrenceTypes.join('; '),
        'Outro Tipo (Detalhe)': occ.occurrenceTypes.includes(OccurrenceType.OTHER) ? occ.otherOccurrenceType : 'N/A',
        'Descrição Detalhada': occ.detailedDescription,
        'Pessoas Envolvidas': occ.involvedPeople,
        'Providências Imediatas': occ.immediateActions,
        'Encaminhamentos': occ.referrals,
        'Avaliação Serviço Social': occ.socialServiceEvaluation,
        'Registrado em': new Date(occ.createdAt).toLocaleString('pt-BR'),
        'Atualizado em': new Date(occ.updatedAt).toLocaleString('pt-BR'),
    }));

    const worksheet = window.XLSX.utils.json_to_sheet(dataToExport);
    worksheet["!cols"] = Object.keys(dataToExport[0] || {}).map(key => ({ wch: Math.max(key.length, 20) }));
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Ocorrências');
    window.XLSX.writeFile(workbook, 'relatorio_detalhado_ocorrencias.xlsx');
};

// --- Generates a SINGLE occurrence PDF, formatted like the official form ---
export const generateSingleOccurrencePdf = (occ: Occurrence): void => {
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