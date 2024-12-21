/** Отрисовщик элементов страницы */
export class Section {

  constructor({renderer}, containerSelector) {
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  addItem(element){
    this._container.append(element);
  }

  addNewItem(element){
    this._container.prepend(element);
  }

  /** Отрисовывает элементы (вначале очищает содержимое контейнера) */
  renderElements(items){
    this._container.innerHTML = '';
    items.forEach((element) => {
      this._renderer(element);
    });
  }

}
