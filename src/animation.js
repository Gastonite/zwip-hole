import Animation from 'zwip/src/animation';
import { parse as parseStyle, stringify as renderStyle } from 'style-attr';

import { isElement, isObject } from 'zwip/src/utils';

const _defaultStyle = {
  position: 'absolute'
};

const _parseOptions = (options) => {

  isObject(options, 'options');
  isElement(options.element, 'element');
  isElement(options.container, 'container');

  return options;
};

const HoleAnimation = (options = {}) => {

  const { container, element } = _parseOptions(options);


  let _center;
  let _rect;
  let _style;
  let _clone;
  let _r1;
  let _r2;
  let _difference;



  const _getCorners = offset => {

    const topLeft = { x: offset.left, y: offset.top };
    const topRight = { x: offset.right, y: offset.top };
    const bottomLeft = { x: offset.left, y: offset.bottom };
    const bottomRight = { x: offset.right, y: offset.bottom };

    const positions = [
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    ];

    return Object.assign(positions, {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    })
  };

  const _calculateDistance = (from, to) => {

    return Math.sqrt(
      Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)
    )
  };

  const _getCenter = rect => {
    return {
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2)
    }
  };

  const start = () => {



    // console.log('r1:', _r1)
    // console.log('r2:', _r2)
    // console.log('difference:', _difference)


    // style.position = 'relative';
    // style.margin = 'auto';

    // container.insertBefore(_clone, element);

    _clone = element.cloneNode();
    console.log(element.offsetTop, element.offsetLeft);


    container.insertBefore(_clone, element);

    _style = Object.assign(parseStyle(element), _defaultStyle);

    render();


  };

  const update = () => {

    const v = animation.value;

    // console.log('_difference:', _difference, _rect);
    _style.width = _style.height = _rect.width + (2 * _difference * v);

    // console.log(`v=${v}, r2=${_style.width / 2}`)

    // console.log('R:', _style.width);

    _style.left = `${(1 - (_style.width / 2)) + _center.x - _rect.left}px`;
    _style.top = `${(1 - (_style.height / 2)) + _center.y - _rect.top}px`;

  };

  const render = () => {

    _clone.setAttribute('style', renderStyle(_style));

  };

  _rect = element.getBoundingClientRect();
  _center = _getCenter(_rect);

  _r1 = _rect.width / 2;

  const containerCorners = _getCorners(container.getBoundingClientRect());
  const distances = containerCorners.map(_calculateDistance.bind(null, _center));

  _r2 = Math.max(...distances);

  _difference = _r2 - _r1;


  const stop = () => {

    // _clone.setAttribute('style', '');

    _clone && _clone.remove();
  };






  const animation = Animation(Object.assign(options, {
    update,
    render,
    start,
    stop
  }));

  return animation;
};

export default HoleAnimation;