export function flattenQuotationGroups(groups) {
  return groups.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      categoryId: group.id,
      categoryTitle: group.title,
    }))
  );
}

export function getSelectedServices(groups, selectedIds) {
  return flattenQuotationGroups(groups).filter((service) => selectedIds.includes(service.id));
}

export function groupSelectedServices(selectedServices) {
  return selectedServices.reduce((groups, service) => {
    const existingGroup = groups.find((group) => group.categoryTitle === service.categoryTitle);

    if (existingGroup) {
      existingGroup.items.push(service);
      return groups;
    }

    return [...groups, { categoryTitle: service.categoryTitle, items: [service] }];
  }, []);
}

export function validateQuotationRequest({ name, mobile, selectedServices }) {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Please enter your name';
  }

  if (!mobile.trim()) {
    errors.mobile = 'Please enter your mobile number';
  }

  if (selectedServices.length === 0) {
    errors.services = 'Please select at least one service or package';
  }

  return errors;
}

export function buildQuotationMessage({ name, mobile, location, selectedServices }) {
  const groupedSelections = groupSelectedServices(selectedServices);
  const selectionLines = groupedSelections.flatMap((group) => [
    `${group.categoryTitle}:`,
    ...group.items.map((service) => `- ${service.name}${service.priceLabel ? ` (${service.priceLabel})` : ''}`),
  ]);

  return [
    'Hi Dhanya Makeup Studio, I would like to get a quotation.',
    `Name: ${name.trim()}`,
    `Mobile Number: ${mobile.trim()}`,
    `Location: ${location.trim() || 'Not provided'}`,
    'Selected Services / Packages:',
    ...selectionLines,
    'Please share the quotation and availability.',
  ].join('\n');
}

export function buildWhatsAppUrl(phoneNumber, message) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
