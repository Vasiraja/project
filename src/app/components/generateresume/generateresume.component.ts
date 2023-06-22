import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import * as pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

type Style = {
  fontSize?: number;
  bold?: boolean;
  margin?: [number, number, number, number];
};

type StyleDictionary = {
  [key: string]: Style;
};

@Component({
  selector: 'app-generateresume',
  templateUrl: './generateresume.component.html',
  styleUrls: ['./generateresume.component.css']
})
export class GenerateresumeComponent {
  personalInfo = {
    name: '',
    email: '',
    phone: '',
  };

  educationItems = [
    { institution: '', degree: '', year: null }
  ];

  workExperienceItems = [
    { company: '', position: '', duration: '' }
  ];

  skills = [''];

  addEducationItem() {
    this.educationItems.push({ institution: '', degree: '', year: null });
  }

  addWorkExperienceItem() {
    this.workExperienceItems.push({ company: '', position: '', duration: '' });
  }

  addSkill() {
    this.skills.push('');
  }

  async generateResume(event: Event): Promise<void> {
    event.preventDefault();
    const content: any[] = [];

    // Header
    content.push({ text: 'Resume', style: 'header' });

    // Personal Information
    content.push({ text: 'Personal Information', style: 'subheader' });
    content.push({ text: `Name: ${this.personalInfo.name}`, margin: [0, 5, 0, 0] });
    content.push({ text: `Email: ${this.personalInfo.email}`, margin: [0, 0, 0, 5] });
    content.push({ text: `Phone: ${this.personalInfo.phone}`, margin: [0, 0, 0, 10] });

    // Education
    content.push({ text: 'Education', style: 'subheader' });
    this.educationItems.forEach(educationItem => {
      content.push(
        { text: `${educationItem.institution}\n${educationItem.degree} - ${educationItem.year}` },
        '\n'
      );
    });

    // Work Experience
    content.push({ text: 'Work Experience', style: 'subheader' });
    this.workExperienceItems.forEach(workExperienceItem => {
      content.push(
        { text: `Position: ${workExperienceItem.position}\n Industry: ${workExperienceItem.company} (${workExperienceItem.duration})` },
        '\n'
      );
    });

    // Skills
    content.push({ text: 'Skills', style: 'subheader' });
    content.push(this.skills.join(', '));

    const styles: StyleDictionary = {
      header: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
    };

    const docDefinition = {
      content,
      styles,
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBase64(async (data) => {
      const file = await fetch(`data:application/pdf;base64,${data}`);
      const fileBlob = await file.blob();
      saveAs(fileBlob, 'resume.pdf');
    });
  }
}
