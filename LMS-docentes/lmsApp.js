createElementFunction = function (elementName, elementClass, elementTextContent, elementId) {
  var newElement = document.createElement(elementName);
  if (elementClass != '') {
      newElement.className = elementClass;
  }
  if (elementTextContent != '') {
      newElement.textContent = elementTextContent;
  }
  if (elementId != '') {
      newElement.id = elementId;
  }
  return newElement;
}