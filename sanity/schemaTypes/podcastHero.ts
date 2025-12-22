import { defineField, defineType } from "sanity";

export const podcastHero = defineType({
  name: "podcastHero",
  title: "Podcast Hero",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Where Brain Science Meets a Healthier Future for Everyone",
    }),
    defineField({
        name: "description",
        title: "Description",
        type: "string",
        initialValue: "Brain Meets Bytes explores breakthroughs in neuroscience, healthy aging, and human longevity—translating emerging science into insights that help us all live longer, healthier, and sharper lives.",
    }),
    defineField({
      name: "newReleasePodcastTitle",
      title: "New Release Podcast Title",
      type: "string",
      initialValue: "Healthier Future",
    }),
    defineField({
      name: "author",
      title: "Author / Host",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Published date",
      type: "datetime",
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
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});