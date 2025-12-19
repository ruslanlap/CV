export interface Contact {
    email: string;
    phone: string;
    telegram: string;
    github: string;
    linkedin: string;
}

export interface SkillGroup {
    [key: string]: string[];
}

export interface Experience {
    role: string;
    company: string;
    period: string;
    points: string[];
}

export interface Project {
    name: string;
    desc: string;
    link: string;
    stack?: string[];
}

export interface Language {
    name: string;
    level: string;
}

export interface Course {
    name: string;
    source: string;
    date: string;
}

export interface CV {
    name: string;
    role: string;
    location: string;
    contacts: Contact;
    summary: string;
    skills: SkillGroup;
    experience: Experience[];
    projects: Project[];
    languages: Language[];
    courses: Course[];
    hobbies: string[];
    title?: string;
}
