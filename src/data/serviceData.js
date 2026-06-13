export const SERVICE_GROUPS = [
  {
    id: 'makeup',
    label: 'Makeup',
    options: [
      { value: 'bridal-makeup', label: 'Bridal Makeup' },
      { value: 'party-makeup', label: 'Party Makeup' },
      { value: 'engagement-makeup', label: 'Engagement Makeup' },
      { value: 'hd-makeup', label: 'HD Makeup' },
      { value: 'airbrush-makeup', label: 'Airbrush Makeup' },
      { value: 'glass-glow-makeup', label: 'Glass Glow Makeup' },
    ],
  },
  {
    id: 'skin-care',
    label: 'Skin Care',
    options: [
      { value: 'facials', label: 'Facials' },
      { value: 'clean-up', label: 'Clean-up' },
      { value: 'skin-polishing', label: 'Skin Polishing' },
      { value: 'de-tan-treatment', label: 'De-tan Treatment' },
      { value: 'bleach', label: 'Bleach' },
      { value: 'eyebrow-threading', label: 'Eyebrow Threading' },
      { value: 'upper-lip-threading', label: 'Upper Lip Threading' },
      { value: 'forehead-threading', label: 'Forehead Threading' },
    ],
  },
  {
    id: 'hair-care',
    label: 'Hair Care',
    options: [
      { value: 'hair-cut', label: 'Hair Cut' },
      { value: 'hair-wash', label: 'Hair Wash' },
      { value: 'hair-spa', label: 'Hair Spa' },
      { value: 'hair-coloring', label: 'Hair Coloring' },
      { value: 'hair-straightening', label: 'Hair Straightening' },
      { value: 'hair-smoothening', label: 'Hair Smoothening' },
      { value: 'keratin-treatment', label: 'Keratin Treatment' },
    ],
  },
  {
    id: 'body-care',
    label: 'Body Care',
    options: [
      { value: 'manicure', label: 'Manicure' },
      { value: 'pedicure', label: 'Pedicure' },
      { value: 'gel-polish', label: 'Gel Polish' },
      { value: 'nail-extensions', label: 'Nail Extensions' },
      { value: 'full-arms-waxing', label: 'Full Arms Waxing' },
      { value: 'full-legs-waxing', label: 'Full Legs Waxing' },
      { value: 'underarm-waxing', label: 'Underarm Waxing' },
      { value: 'face-waxing', label: 'Face Waxing' },
      { value: 'rica-wax', label: 'Rica Wax' },
      { value: 'polishing', label: 'Polishing' },
      { value: 'body-detan-treatment', label: 'Detan Treatment' },
    ],
  },
  {
    id: 'bridal-services',
    label: 'Bridal Services',
    options: [
      { value: 'bridal-packages', label: 'Bridal Packages' },
      { value: 'pre-bridal-treatments', label: 'Pre-Bridal Treatments' },
      { value: 'saree-draping-pre-pleating', label: 'Saree Draping / Pre-Pleating' },
      { value: 'hairstyling', label: 'Hairstyling' },
      { value: 'mehendi', label: 'Mehendi' },
      { value: 'jewellery', label: 'Jewellery' },
      { value: 'flowers', label: 'Flowers' },
      { value: 'lens-lashes', label: 'Lens / Lashes' },
    ],
  },
];

export const SERVICE_OPTIONS = SERVICE_GROUPS.flatMap((group) => group.options);
