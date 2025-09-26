// sampleData.ts

// Types
export interface Client {
  name: string;
  email: string;
  phone: string;
}

export interface Project {

  clientId: number;
  name: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
}

export interface User {
  id?: number;          // optional if using auto-increment
  email: string;
  password: string;
  role: "USER" | "SUPERUSER";
}


// Clients
export const clients: Client[] = [
  {

    name: "Steve Roytis",
    email: "steve@gmail.com",
    phone: "344-562-6787",
  },
  {

    name: "Tony Stark",
    email: "tony@starkindustries.com",
    phone: "123-456-7890",
  },
  {
 
    name: "Natasha Romanoff",
    email: "natasha@gmail.com",
    phone: "555-666-7777",
  },
  {
  
    name: "Peter Parker",
    email: "peterparker@gmail.com",
    phone: "888-999-1111",
  },
  {
  
    name: "Bruce Banner",
    email: "bruce@gmail.com",
    phone: "321-468-8887",
  },
];

// Projects
export const projects: Project[] = [
  {
  
    clientId: 1,
    name: "eCommerce Website",
    description:
      "A modern eCommerce platform with shopping cart, payment gateway integration, and product management dashboard.",
    status: "In Progress",
  },
  {
   
    clientId: 2,
    name: "Dating App",
    description:
      "A cross-platform mobile dating app featuring user profiles, chat, and location-based matching.",
    status: "Not Started",
  },
  {
  
    clientId: 3,
    name: "Cybersecurity Dashboard",
    description:
      "An enterprise-grade dashboard for monitoring and analyzing real-time cyber threats and vulnerabilities.",
    status: "Completed",
  },
  {
  
    clientId: 4,
    name: "Portfolio Website",
    description:
      "A personal portfolio website showcasing projects, blogs, and professional achievements.",
    status: "In Progress",
  },
  {
 
    clientId: 5,
    name: "AI Research Platform",
    description:
      "A collaborative platform for machine learning researchers to share datasets, run experiments, and publish results.",
    status: "Not Started",
  },
];

// Users
export const users: User[] = [
  {
    email: "admin@system.com",
    password: "supersecret",
    role: "SUPERUSER",
  },
  {
    email: "john.doe@example.com",
    password: "password123",
    role: "USER",
  },
];
