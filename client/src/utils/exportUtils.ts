import Papa from 'papaparse';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportData {
  validators?: any[];
  integrators?: any[];
  transactions?: any[];
  stats?: any;
  metadata?: {
    exportTime: string;
    exportType: string;
    totalRecords: number;
  };
}

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], filename: string) => {
  try {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export CSV file');
  }
};

/**
 * Export validator data to CSV with compliance and performance metrics
 */
export const exportValidatorsToCSV = (validators: any[]) => {
  const exportData = validators.map(validator => ({
    'Validator Name': validator.name,
    'Network': validator.network,
    'Token': validator.token_symbol,
    'Address': validator.address,
    'Uptime %': validator.uptime,
    'Commission %': validator.commission,
    'APY %': validator.apy,
    'Compliance Status': validator.complianceStatus,
    'Last Slashing': validator.lastSlashing || 'None',
    'Creation Date': validator.creation_time,
    'Badges': validator.badges?.map((b: any) => b.label).join(', ') || 'None',
    'URL': validator.url || 'N/A'
  }));
  
  exportToCSV(exportData, 'kiln_validators_report');
};

/**
 * Export integrator performance data to CSV
 */
export const exportIntegratorsToCSV = (integrators: any[]) => {
  const exportData = integrators.map(integrator => ({
    'Integrator Name': integrator.name,
    'Type': integrator.type,
    'Market Share %': integrator.marketShare,
    'Total Staked ETH': integrator.totalStaked,
    'Validators Count': integrator.validators,
    'APY %': integrator.apy,
    'Fee %': integrator.fees,
    '24h Change %': integrator.change24h,
    'TVL USD': integrator.tvl
  }));
  
  exportToCSV(exportData, 'kiln_integrators_performance');
};

/**
 * Export transaction history to CSV
 */
export const exportTransactionsToCSV = (transactions: any[]) => {
  const exportData = transactions.map(tx => ({
    'Transaction Hash': tx.hash,
    'Type': tx.type,
    'Amount ETH': tx.amountETH,
    'Amount USD': tx.amountUSD,
    'Integrator': tx.integrator,
    'Validator': tx.validator,
    'Status': tx.status,
    'Block Number': tx.blockNumber,
    'Gas Used': tx.gasUsed,
    'Fee ETH': tx.fee,
    'Risk Score': tx.riskScore,
    'Timestamp': tx.timestamp,
    'Depositor': tx.depositor
  }));
  
  exportToCSV(exportData, 'kiln_transactions_history');
};

/**
 * Generate comprehensive PDF report
 */
export const exportToPDF = async (elementId: string, filename: string, title: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add title
    pdf.setFontSize(20);
    pdf.text(title, 20, 20);
    
    // Add metadata
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    pdf.text('Powered by Kiln Explorer', 20, 35);
    
    // Add image
    const imgWidth = 170;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 45;

    pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - position - 20;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 20;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;
    }

    pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF file');
  }
};

/**
 * Export comprehensive dashboard data
 */
export const exportDashboardData = (data: ExportData) => {
  const exportPackage = {
    metadata: {
      exportTime: new Date().toISOString(),
      exportType: 'comprehensive_dashboard',
      totalRecords: (data.validators?.length || 0) + (data.integrators?.length || 0) + (data.transactions?.length || 0)
    },
    networkStats: data.stats,
    validators: data.validators,
    integrators: data.integrators,
    transactions: data.transactions?.slice(0, 100) // Limit transactions for size
  };

  const jsonStr = JSON.stringify(exportPackage, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `kiln_dashboard_export_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export compliance report
 */
export const exportComplianceReport = (validators: any[]) => {
  const complianceData = validators.map(validator => ({
    'Validator Name': validator.name,
    'Address': validator.address,
    'Network': validator.network,
    'Compliance Status': validator.complianceStatus,
    'Risk Level': validator.complianceStatus === 'FLAGGED' ? 'HIGH' : 
                  validator.complianceStatus === 'CLEAR' ? 'LOW' : 'UNKNOWN',
    'Last Checked': new Date().toISOString(),
    'Screening Method': 'OFAC Sanctions List',
    'Notes': validator.complianceStatus === 'FLAGGED' ? 'Address found on sanctions list' : 
             validator.complianceStatus === 'CLEAR' ? 'Address cleared for sanctions' : 
             'Unable to verify address'
  }));
  
  exportToCSV(complianceData, 'kiln_compliance_report');
};

/**
 * Export staking performance data to PDF report (for ExplorerPro)
 */
export const exportStakingPerformanceToPDF = (data: {
  stats: any;
  integrators: any[];
  transactions: any[];
}) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(255, 107, 53); // Kiln orange
    doc.text('Kiln Staking Performance Report', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    // Stats Summary
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Performance Summary', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    if (data.stats) {
      doc.text(`Total Staked: ${data.stats.totalStaked || 'N/A'} ETH`, margin, yPosition);
      yPosition += 8;
      doc.text(`Total Rewards: ${data.stats.totalRewards || 'N/A'} ETH`, margin, yPosition);
      yPosition += 8;
      doc.text(`Average APY: ${data.stats.averageAPY || 'N/A'}%`, margin, yPosition);
      yPosition += 8;
      doc.text(`Active Validators: ${data.stats.activeValidators || 'N/A'}`, margin, yPosition);
      yPosition += 15;
    }

    // Save PDF
    doc.save(`kiln_staking_performance_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF file');
  }
};
