import './table.css';
import tableTempl from "./table.template";
import engine from '../../lib/engine/engine';
import Arrow from '../arrow/arrow';

import { swapDom } from '../../lib/utils';

export default class Table {
    constructor(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        this.container = container;
        this.props = ['id', 'title', 'imdb', 'year'];
        this.activeTh = null;
        this.arrow = new Arrow();
    }

    render(data) {
        const html = engine(tableTempl(data));
        this.container.innerHTML = html;
        this.trArr = [...this.container.children].map((node, i) => ({
            node: node,
            position: i,

            id: +node.dataset.id,
            title: node.dataset.title,
            year: +node.dataset.year,
            imdb: node.dataset.imdb,
        }));
    }

    sortTable(prop, callback) {
        this.trArr = callback(prop, this.trArr);
        this.replace();
        this.arrow.rotate();
        this.setActiveColumnFilter(prop);
    }

    replace() {
        this.trArr.forEach((tr, i) => {
            const tr1 = tr;
            const { position: trPos1 } = tr1;

            if (+trPos1 !== i) {
                const tr2 = this.trArr[trPos1];
                const { position: trPos2 } = tr2;

                swapDom(tr1.node, tr2.node);
                tr1.position = trPos2;
                tr2.position = trPos1;
            }
        })        
    }

    setActiveColumnFilter(prop) {
        if (this.activeTh) {
            this.activeTh.innerHTML = this.activeTh.textContent;
        }
        const arrTh = [...document.querySelectorAll('th')];
        const propTh = arrTh.find((th) => th.textContent === prop);

        this.activeTh = propTh;
        this.activeTh.appendChild(this.arrow.node);
    }
}


