INSERT INTO pages (slug, title, seo_title, seo_desc) VALUES
('home', 'AI Global Experts', 'AI Global Experts — Secure AI Innovation', 'Security scans & contact')
ON CONFLICT (slug) DO NOTHING;

-- Select page id
WITH home AS (
  SELECT id FROM pages WHERE slug='home' LIMIT 1
)
INSERT INTO page_blocks (page_id, position, block_type, data) VALUES
((SELECT id FROM home), 1, 'hero', json_build_object(
  'heading', 'Unlock Secure AI Innovation',
  'sub', 'Security scans for AI tools & integrations',
  'ctaLabel', 'Request a scan',
  'ctaLink', '/security-scan'
)),
((SELECT id FROM home), 2, 'richtext', json_build_object(
  'html', '<p>We help you adopt AI safely: quick assessments, governance, vendor due diligence, threat modeling.</p>'
)),
((SELECT id FROM home), 3, 'form_cta', json_build_object(
  'title', 'Contact us',
  'text', 'Questions or collaboration? Leave your details and we will get back to you.',
  'formKey', 'contact'
));
