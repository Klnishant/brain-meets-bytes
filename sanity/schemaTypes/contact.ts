import { defineType, defineField } from "sanity";

export const contact = defineType({
    name: "contact",
    title: "Contact",
    type: "document",
    fields: [
        defineField({
            name: "heading",
            title: "Heading",
            type: "string",
        }),
        defineField({
            name: "body",
            title: "Body",
            type: "text",
            rows: 4,
        }),
        defineField({
            name: "phone",
            title: "Phone",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
    ],
});