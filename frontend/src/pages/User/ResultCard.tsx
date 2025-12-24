import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculateResponse } from '../../services/api/coreApi';

interface ResultCardProps {
  result: CalculateResponse | null;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Utility Billing Receipt', 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.text('Prepared for: Valued Customer', 20, 36);

    autoTable(doc, {
      startY: 48,
      head: [['Description', 'Amount']],
      body: [
        [`Units (${result.units}) x $${result.ratePerUnit.toFixed(2)}`, `$${result.subtotal.toFixed(2)}`],
        ['VAT', `$${result.vatAmount.toFixed(2)}`],
        ['Service Charge', `$${result.serviceCharge.toFixed(2)}`],
        [{ content: 'Total Due', styles: { fontStyle: 'bold' } }, { content: `$${result.total.toFixed(2)}`, styles: { fontStyle: 'bold' } }],
      ],
      styles: { halign: 'right' },
      headStyles: { fillColor: [33, 150, 243], halign: 'center' },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' },
      },
    });

    const finalY = ((doc as any).lastAutoTable?.finalY as number | undefined) ?? 120;
    doc.text('Thank you for choosing BillCalc.', 20, finalY + 20);
    doc.save('utility-billing-receipt.pdf');
  };

  if (!result) {
    return (
      <div className="result-card empty">
        <div className="empty-icon">🧮</div>
        <h3>No Calculation Yet</h3>
        <p>Enter your units on the left and hit calculate to see your detailed bill breakdown.</p>
      </div>
    );
  }

  return (
    <div className="result-card">
      <div className="result-header">
        <div>
          <p>Summary</p>
          <h3>${result.total.toFixed(2)}</h3>
        </div>
        <button className="ghost-btn" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>
      <ul className="result-details">
        <li>
          <span>Units</span>
          <strong>{result.units}</strong>
        </li>
        <li>
          <span>Subtotal</span>
          <strong>${result.subtotal.toFixed(2)}</strong>
        </li>
        <li>
          <span>VAT</span>
          <strong>${result.vatAmount.toFixed(2)}</strong>
        </li>
        <li>
          <span>Service Charge</span>
          <strong>${result.serviceCharge.toFixed(2)}</strong>
        </li>
      </ul>
    </div>
  );
};

export default ResultCard;
