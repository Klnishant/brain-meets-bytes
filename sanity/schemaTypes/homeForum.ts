import { defineField, defineType } from "sanity";

export const homeForum = defineType({
    name: "homeForum",
    title: "Home Forum",
    type: "document",
    fields: [
        defineField({
            name: "heading",
            title: "Heading",
            type: "string",
            initialValue: "Join the Brain Meets Bytes Community",
        }),
        defineField({
                name: "description",
                title: "Description",
                type: "text",
                rows: 4,
                initialValue: "Connect with listeners, researchers, and practitioners who care about brain health and longevity. Ask questions, share ideas, and continue the conversations that start in each episode.",
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