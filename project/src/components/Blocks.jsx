import React from 'react';
import Hero from './blocks/Hero';
import RichText from './blocks/RichText';
import Gallery from './blocks/Gallery';
import FormCTA from './blocks/FormCTA';

const blockComponents = {
  hero: Hero,
  richtext: RichText,
  gallery: Gallery,
  form_cta: FormCTA,
};

export default function Blocks({ blocks }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block) => {
        const Component = blockComponents[block.block_type];
        if (!Component) {
          console.warn(`Unknown block type: ${block.block_type}`);
          return null;
        }
        return <Component key={block.id} data={block.data} />;
      })}
    </>
  );
}
