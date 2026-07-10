-- Sample catalogue for local development / demo purposes.
-- Replace image_url / cloudinary_public_id with real Cloudinary assets before going live.

insert into public.products (name, slug, description, price, category, image_url, cloudinary_public_id, stock, featured)
values
  ('ELK Oversized Boxy Tee', 'elk-oversized-boxy-tee', 'Heavyweight 260gsm cotton, boxy cut, garment-dyed for a lived-in finish.', 45000, 'Clothing', '/placeholder-product.svg', null, 24, true),
  ('ELK Cargo Utility Pants', 'elk-cargo-utility-pants', 'Straight-leg cargo in ripstop cotton with reinforced stitching.', 68000, 'Clothing', '/placeholder-product.svg', null, 15, true),
  ('ELK Pure Leather Belt', 'elk-pure-leather-belt', 'Full-grain leather belt with brushed gunmetal buckle.', 32000, 'Accessories', '/placeholder-product.svg', null, 40, false),
  ('ELK Signature Beanie', 'elk-signature-beanie', 'Ribbed knit beanie with woven ELK badge.', 18500, 'Beanies', '/placeholder-product.svg', null, 60, false),
  ('ELK Vintage Wash Cap', 'elk-vintage-wash-cap', 'Six-panel cap, acid-washed for a worn-in look.', 22000, 'Caps', '/placeholder-product.svg', null, 33, true),
  ('ELK Structured Tote', 'elk-structured-tote', 'Canvas tote with leather trim and internal pocket.', 39000, 'Bags', '/placeholder-product.svg', null, 18, false)
on conflict (slug) do nothing;
