// Function to merge two PDFs using pdf-lib
async function mergePDFs(pdf1Bytes, pdf2Bytes) {
    const { PDFDocument } = PDFLib;

    // Create a new PDF document to hold merged content
    const pdfDoc = await PDFDocument.create();

    // Load both PDFs into PDFLib objects
    const pdf1 = await PDFDocument.load(pdf1Bytes);
    const pdf2 = await PDFDocument.load(pdf2Bytes);

    // Copy pages from the first PDF and add to the merged document
    const pages1 = await pdfDoc.copyPages(pdf1, pdf1.getPageIndices());
    pages1.forEach(page => pdfDoc.addPage(page));

    // Copy pages from the second PDF and add to the merged document
    const pages2 = await pdfDoc.copyPages(pdf2, pdf2.getPageIndices());
    pages2.forEach(page => pdfDoc.addPage(page));

    // Save the final merged PDF as a byte array
    return await pdfDoc.save();
}

// Event listener for the form submission
document.getElementById('pdfForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    // Collect form data and validate
    const university = document.getElementById('txtUniversity').value.trim();
    const department = document.getElementById('txtDepartment').value.trim();
    const subject = document.getElementById('txtSubject').value.trim();
    const submittedTo = document.getElementById('txtSubmittedTo').value.trim();
    const submittedBy = document.getElementById('txtSubmittedBy').value.trim();
    const rollNo = document.getElementById('txtRollNo').value.trim();

    if (!university || !department || !subject || !submittedTo || !submittedBy || !rollNo) {
        alert('Please fill in all fields.');
        return;
    }

    // Create a new PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // // Load an image to add to the PDF
    // const imgURL = 'mdu logo.jpg'; // Replace with the actual path to your image
    // const img = new Image();
    // img.src = imgURL;

    // img.onload = () => {
    //     // Add image to the PDF (adjust coordinates and dimensions as needed)
    //     doc.addImage(img, 'JPEG', 70,40, 70, 40); // x, y, width, height

    //     // Add text content to the new PDF
    //     doc.setFontSize(24);
    //     doc.text(university, 105, 60, { align: 'center' });
    //     doc.setFontSize(20);
    //     doc.text(department, 105, 80, { align: 'center' });
    //     doc.setFontSize(18);
    //     doc.text(`Practical of ${subject}`, 105, 100, { align: 'center' });

    //     // Add submitted to/by details
    //     doc.setFontSize(16);
    //     doc.text('Submitted To:', 50, 130);
    //     doc.text('Submitted By:', 150, 130);
    //     doc.setFontSize(14);
    //     doc.text(`Prof. ${submittedTo}`, 50, 140);
    //     doc.text(submittedBy, 150, 140);
    //     doc.text(`Roll No: ${rollNo}`, 150, 150);

    //     // Add footer text
    //     doc.setFontSize(16);
    //     doc.text('5-Year Integrated M.Sc.(Hons.) Mathematics (7th Sem)', 105, 180, { align: 'center' });
        //Image addition logic
        const imgUrl = 'mdu logo.jpg'; // Replace with your image path or URL
        
        const image = new Image();
        image.src = imgUrl;
        image.onload = function () {
        // Add the image at the specified position
        const imgX = 65; // X position
        const imgY = 20; // Y position (adjusted to center content)
        const imgWidth = 80; // Image width
        const imgHeight = 70; // Image height
        
        doc.addImage(image, 'JPEG', imgX, imgY, imgWidth, imgHeight); // Add the image

        // Set font to bold for all text
        doc.setFont("Helvetica", "bold");

        // Centered text positioning
        const textX = 105; // Center position for text
        const universityY = imgY + imgHeight + 20; // Position below the image
        // Draw a line after the university name
        doc.setDrawColor(0); // Set the color for the line
        doc.setLineWidth(0.5); // Set line width
        doc.line(30, universityY + 5, 180, universityY + 5); // Line after university name
        const departmentY = universityY + 23; // Spacing below the university name
        const subjectY = departmentY + 23; // Spacing below the department name

        // Add text fields below the image
        doc.setFontSize(24);
        doc.text(document.getElementById('txtUniversity').value, textX, universityY, { align: 'center' });
        
        doc.setFontSize(20);
        doc.text(document.getElementById('txtDepartment').value, textX, departmentY, { align: 'center' });
        
        doc.setFontSize(18);
        doc.text('Practical of ' + document.getElementById('txtSubject').value, textX, subjectY, { align: 'center' });

        // Add submitted to/by details
        const submittedToY = subjectY + 23; // Positioning below subject
        const submittedByY = submittedToY + 10; // Spacing between fields
        const rollNoY = submittedByY + 10; // Spacing for roll number

        doc.setFontSize(16);
        doc.text('Submitted To:', 50, submittedToY);
        doc.text('Submitted By:', 130, submittedToY);
        doc.setFontSize(14);
        doc.text(`Prof. ${document.getElementById('txtSubmittedTo').value}`, 50, submittedByY);
        doc.text(document.getElementById('txtSubmittedBy').value, 130, submittedByY);
        doc.text(`Roll No: ${document.getElementById('txtRollNo').value}`, 130, rollNoY);
        // Draw a line after the university name
        doc.setDrawColor(0); // Set the color for the line
        doc.setLineWidth(0.5); // Set line width
        doc.line(30, rollNoY + 5, 180, rollNoY + 5); // Line after university name
        // Add footer text
        const footerY = rollNoY + 23; // Position footer below the last entry
        doc.setFontSize(20);
        doc.text('5-Year Integrated M.Sc.(Hons.) Mathematics (7th Sem)', textX, footerY, { align: 'center' });

        // Convert jsPDF output to an ArrayBuffer for merging
        const pdfBytes = doc.output('arraybuffer');

        // Fetch an existing PDF to merge (adjust URL as necessary)
        const existingPdfUrl = 'OOPs Practical File.pdf'; // Replace with actual file URL
        fetch(existingPdfUrl)
            .then(res => res.arrayBuffer())
            .then(existingPdfBytes => {
                // Merge the new PDF with the existing one
                mergePDFs(pdfBytes, existingPdfBytes).then(mergedPdfBytes => {
                    // Create a Blob and download the merged PDF
                    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `${submittedBy}_Merged_Practical_File.pdf`;
                    link.click();
                });
            });
    };
});
