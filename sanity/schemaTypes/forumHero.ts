import { defineField, defineType } from "sanity";

export const forumHero = defineType({
  name: "forumHero",
  title: "Forum Hero",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Brain Meets Bytes Community",
    }),
    defineField({
        name: "description",
        title: "Description",
        type: "string",
        initialValue: "Breakthroughs don't happen alone. Connect with fellow listeners, researchers, and health enthusiasts exploring smarter brain health and longevity together.",
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [
        {
          type: "object",
          name: "author",
          title: "Author",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "content",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Author Image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
        },
      ],
    }),
  ],
});