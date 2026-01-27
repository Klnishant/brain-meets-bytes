import { defineField, defineType } from "sanity";

export const aboutForum = defineType({
    name: "aboutForum",
    title: "About Forum",
    type: "document",
    fields: [
        defineField({
            name: "heading",
            title: "Heading",
            type: "string",
            initialValue: "Join the Conversation",
        }),
        defineField({
           name: "descriptionTag",
           title: "Description Tag",
           type: "string", 
        }),
        defineField({
                name: "description",
                title: "Description",
                type: "text",
                rows: 4,
                initialValue: "Join a community of curious minds, health innovators, and lifelong learners who are passionate about advancing smarter brain health and longevity. Share ideas, ask questions, and grow together as we shape the future of human health.",
        }),
        defineField({
            name: "Card",
            title: "Card",
            type: "document",
            fields: [
                defineField({
                    name: "title",
                    title: "Title",
                    type: "string",
                }),
                defineField({
                    name: "description",
                    title: "Description",
                    type: "string",
                }),
                defineField({
                    name: "user",
                    title: "User",
                    type: "string",
                }),
                defineField({
                    name: "role",
                    title: "Role",
                    type: "string",
                }),
                defineField({
                   name: "tags",
                   title: "Tags",
                   type: "array",
                   of: [{ type: "string" }], 
                }),
                defineField({
                    name: "date",
                    title: "Published date",
                    type: "datetime",
                    initialValue: new Date().toISOString(),
                }),
                defineField({
                    name: "profileImage",
                    title: "Profile Image",
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                }),
                defineField({
                    name: "repliesCount",
                    title: "Replies count",
                    type: "number",
                }),
                defineField({
                    name: "reactionCount",
                    title: "Reaction Count",
                    type: "number",
                })
            ],
        })
    ],
});