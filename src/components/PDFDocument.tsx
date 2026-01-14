/**
 * PDF Document Component
 * Generates PDF version of CV using @react-pdf/renderer
 */

import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    Link,
    Image,
} from "@react-pdf/renderer";
import { CV } from "@/types/cv";
import { pdfStyles } from "@/lib/pdf-styles";

interface PDFDocumentProps {
    cv: CV;
    lang: "en" | "ua";
}

export default function PDFDocument({ cv, lang }: PDFDocumentProps) {
    const translations = {
        en: {
            summary: "Professional Summary",
            skills: "Skills",
            experience: "Experience",
            projects: "Projects",
            education: "Education & Courses",
            languages: "Languages",
            hobbies: "R&D & Hobbies",
            generatedOn: "Generated on",
        },
        ua: {
            summary: "Професійний профіль",
            skills: "Навички",
            experience: "Досвід",
            projects: "Проєкти",
            education: "Освіта та Курси",
            languages: "Мови",
            hobbies: "R&D та Хобі",
            generatedOn: "Згенеровано",
        },
    };

    const t = translations[lang];
    const generatedDate = new Date().toLocaleDateString(lang === "ua" ? "uk-UA" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // PDF metadata
    const metadata = {
        title: `${cv.name} - CV`,
        author: cv.name,
        subject: "Curriculum Vitae",
        keywords: "cv, resume, developer, " + Object.values(cv.skills).flat().join(", "),
        creator: "CV Website",
        producer: "React-PDF",
        creationDate: new Date(),
    };

    return (
        <Document
            title={metadata.title}
            author={metadata.author}
            subject={metadata.subject}
            keywords={metadata.keywords}
            creator={metadata.creator}
            producer={metadata.producer}
        >
            <Page size="A4" style={pdfStyles.page}>
                {/* Header Section */}
                <View style={pdfStyles.header}>
                    <View style={pdfStyles.headerContent}>
                        <View style={pdfStyles.headerLeft}>
                            <Text style={pdfStyles.name}>{cv.name}</Text>
                            <Text style={pdfStyles.role}>{cv.role}</Text>
                            <Text style={pdfStyles.location}>{cv.location}</Text>
                            <View style={pdfStyles.contactInfo}>
                                <Link src={`mailto:${cv.contacts.email}`} style={pdfStyles.link}>
                                    {cv.contacts.email}
                                </Link>
                                <Text style={pdfStyles.contactItem}> • </Text>
                                <Text>{cv.contacts.phone}</Text>
                                <Text style={pdfStyles.contactItem}> • </Text>
                                <Link src={`https://t.me/${cv.contacts.telegram.replace("@", "")}`} style={pdfStyles.link}>
                                    {cv.contacts.telegram}
                                </Link>
                            </View>
                            <View style={pdfStyles.contactInfo}>
                                <Link src={`https://github.com/${cv.contacts.github}`} style={pdfStyles.link}>
                                    github.com/{cv.contacts.github}
                                </Link>
                                <Text style={pdfStyles.contactItem}> • </Text>
                                <Link src={`https://linkedin.com/in/${cv.contacts.linkedin}`} style={pdfStyles.link}>
                                    linkedin.com/in/{cv.contacts.linkedin}
                                </Link>
                            </View>
                        </View>
                        {/* Profile image would go here if we have a way to load it */}
                    </View>
                </View>

                {/* Summary Section */}
                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>{t.summary}</Text>
                    <Text style={pdfStyles.summary}>{cv.summary}</Text>
                </View>

                {/* Skills Section */}
                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>{t.skills}</Text>
                    <View style={pdfStyles.skillsGrid}>
                        {Object.entries(cv.skills).map(([group, items]) => (
                            <View key={group} style={pdfStyles.skillGroup}>
                                <Text style={pdfStyles.skillGroupTitle}>{group}</Text>
                                <Text style={pdfStyles.skillItems}>{items.join(", ")}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Experience Section */}
                <View style={pdfStyles.section} wrap={false}>
                    <Text style={pdfStyles.sectionTitle}>{t.experience}</Text>
                    {cv.experience.map((job, index) => (
                        <View key={`${job.company}-${index}`} style={pdfStyles.experienceItem} wrap={false}>
                            <View style={pdfStyles.experienceHeader}>
                                <Text style={pdfStyles.experienceTitle}>{job.role}</Text>
                                <Text style={pdfStyles.experiencePeriod}>{job.period}</Text>
                            </View>
                            <Text style={pdfStyles.experienceCompany}>{job.company}</Text>
                            <View style={pdfStyles.bulletList}>
                                {job.points.map((point, idx) => (
                                    <View key={idx} style={pdfStyles.bulletItem}>
                                        <Text style={pdfStyles.bulletPoint}>•</Text>
                                        <Text style={pdfStyles.bulletText}>{point}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Projects Section */}
                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>{t.projects}</Text>
                    {cv.projects.map((project, index) => (
                        <View key={`${project.name}-${index}`} style={pdfStyles.projectItem}>
                            <Text style={pdfStyles.projectName}>{project.name}</Text>
                            <Text style={pdfStyles.projectDescription}>{project.desc}</Text>
                            <Link src={project.link} style={pdfStyles.projectLink}>
                                {project.link}
                            </Link>
                            {project.stack && (
                                <Text style={pdfStyles.projectStack}>
                                    {project.stack.join(" • ")}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* Education Section */}
                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>{t.education}</Text>
                    <View style={pdfStyles.educationGrid}>
                        {cv.courses.map((course, index) => (
                            <View key={`${course.name}-${index}`} style={pdfStyles.educationItem}>
                                <Text style={pdfStyles.educationName}>{course.name}</Text>
                                <View style={pdfStyles.educationDetails}>
                                    <Text>{course.source}</Text>
                                    <Text>{course.date}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Languages Section */}
                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>{t.languages}</Text>
                    <View style={pdfStyles.languagesContainer}>
                        {cv.languages.map((language, index) => (
                            <Text key={`${language.name}-${index}`} style={pdfStyles.languageItem}>
                                {language.name} — {language.level}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Hobbies Section */}
                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>{t.hobbies}</Text>
                    <View style={pdfStyles.hobbiesContainer}>
                        {cv.hobbies.map((hobby, index) => (
                            <Text key={`${hobby}-${index}`} style={pdfStyles.hobbyItem}>
                                {hobby}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <View style={pdfStyles.footer} fixed>
                    <Text>
                        {t.generatedOn} {generatedDate}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
