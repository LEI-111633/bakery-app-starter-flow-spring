import { html, css, LitElement } from 'lit';
import '@vaadin/button';
import '@vaadin/checkbox';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/text-field';

// Componente customizado chamado "SearchBar"
class SearchBar extends LitElement {
  // Estilos aplicados apenas dentro do componente
  static get styles() {
    return css`
      :host {
        /* Configuração básica da barra de pesquisa */
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 0 var(--lumo-space-s);
        background-image: linear-gradient(
          var(--lumo-shade-20pct),
          var(--lumo-shade-20pct)
        );
        background-color: var(--lumo-base-color);
        box-shadow: 0 0 16px 2px var(--lumo-shade-20pct);
        order: 1;
        width: 100%;
        height: 48px;
        box-sizing: border-box;
      }

      /* Linha de elementos dentro da barra */
      .row {
        display: flex;
        align-items: center;
        height: 3em;
      }

      /* Esconde checkbox, botão de limpar e botão de ação por padrão */
      .checkbox,
      .clear-btn,
      :host([show-extra-filters]) .action-btn {
        display: none;
      }

      /* Mostra botão "Clear" quando filtros extras estão ativos */
      :host([show-extra-filters]) .clear-btn {
        display: block;
      }

      /* Mostra checkbox versão mobile */
      :host([show-checkbox]) .checkbox.mobile {
        display: block;
        transition: all 0.5s;
        height: 0;
      }

      /* Expande o checkbox mobile quando filtros extras aparecem */
      :host([show-checkbox][show-extra-filters]) .checkbox.mobile {
        height: 2em;
      }

      /* Campo de pesquisa ocupa espaço flexível */
      .field {
        flex: 1;
        width: auto;
        padding-right: var(--lumo-space-s);
      }

      /* Layout adaptado para telas maiores */
      @media (min-width: 700px) {
        :host {
          order: 0;
        }

        .row {
          width: 100%;
          max-width: 964px;
          margin: 0 auto;
        }

        .field {
          padding-right: var(--lumo-space-m);
        }

        /* Em telas grandes, mostra checkbox desktop */
        :host([show-checkbox][show-extra-filters]) .checkbox.desktop {
          display: block;
        }

        /* Esconde o checkbox mobile em telas grandes */
        :host([show-checkbox][show-extra-filters]) .checkbox.mobile {
          display: none;
        }
      }
    `;
  }

  // Estrutura HTML do componente
  render() {
    return html`
      <div class="row">
        <!-- Campo de pesquisa com ícone -->
        <vaadin-text-field
          id="field"
          class="field"
          .placeholder="${this.fieldPlaceholder}"
          .value="${this.fieldValue}"
          @value-changed="${(e) => (this.fieldValue = e.detail.value)}"
          @focus="${this._onFieldFocus}"
          @blur="${this._onFieldBlur}"
          theme="white"
        >
          <vaadin-icon icon="${this.fieldIcon}" slot="prefix"></vaadin-icon>
        </vaadin-text-field>

        <!-- Checkbox (desktop) -->
        <vaadin-checkbox
          class="checkbox desktop"
          .checked="${this.checkboxChecked}"
          @checked-changed="${(e) => (this.checkboxChecked = e.detail.value)}"
          @focus="${this._onFieldFocus}"
          @blur="${this._onFieldBlur}"
          .label="${this.checkboxText}"
        ></vaadin-checkbox>

        <!-- Botão para limpar a pesquisa -->
        <vaadin-button id="clear" class="clear-btn" theme="tertiary">
          ${this.clearText}
        </vaadin-button>

        <!-- Botão de ação principal -->
        <vaadin-button id="action" class="action-btn" theme="primary">
          <vaadin-icon icon="${this.buttonIcon}" slot="prefix"></vaadin-icon>
          ${this.buttonText}
        </vaadin-button>
      </div>

      <!-- Checkbox (mobile) -->
      <vaadin-checkbox
        class="checkbox mobile"
        .checked="${this.checkboxChecked}"
        @checked-changed="${(e) => (this.checkboxChecked = e.detail.value)}"
        @focus="${this._onFieldFocus}"
        @blur="${this._onFieldBlur}"
        .label="${this.checkboxText}"
      ></vaadin-checkbox>
    `;
  }

  // Nome do elemento
  static get is() {
    return 'search-bar';
  }

  // Propriedades que podem ser passadas ao componente
  static get properties() {
    return {
      fieldPlaceholder: { type: String }, // Texto placeholder do campo
      fieldValue: { type: String },       // Valor atual do campo
      fieldIcon: { type: String },        // Ícone do campo
      buttonIcon: { type: String },       // Ícone do botão
      buttonText: { type: String },       // Texto do botão
      showCheckbox: { type: Boolean, reflect: true, attribute: 'show-checkbox' }, // Mostrar checkbox
      checkboxText: { type: String },     // Texto do checkbox
      checkboxChecked: { type: Boolean }, // Estado do checkbox
      clearText: { type: String },        // Texto do botão "Clear"
      showExtraFilters: { type: Boolean, reflect: true, attribute: 'show-extra-filters' }, // Mostrar filtros extras
      _focused: { type: Boolean },        // Indica se o campo está focado
    };
  }

  // Executado sempre que alguma propriedade é atualizada
  updated(changedProperties) {
    // Se valor do campo, estado do checkbox ou foco mudarem → chama debounce
    if (
      changedProperties.has('fieldValue') ||
      changedProperties.has('checkboxChecked') ||
      changedProperties.has('_focused')
    ) {
      this._debounceSearch(
        this.fieldValue,
        this.checkboxChecked,
        this._focused
      );
    }

    // Dispara eventos customizados quando certas propriedades mudam
    const notifyingProperties = [
      { property: 'fieldValue', eventName: 'field-value-changed' },
      { property: 'checkboxChecked', eventName: 'checkbox-checked-changed' },
    ];

    notifyingProperties.forEach(({ property, eventName }) => {
      if (changedProperties.has(property)) {
        this.dispatchEvent(
          new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail: { value: this[property] },
          })
        );
      }
    });
  }

  // Construtor: define valores iniciais e cria debounce
  constructor() {
    super();
    this.buttonIcon = 'vaadin:plus';
    this.fieldIcon = 'vaadin:search';
    this.clearText = 'Clear search';
    this.showExtraFilters = false;
    this.showCheckbox = false;

    // Em iOS: evita que a página role quando teclado abre
    this.addEventListener('touchmove', (e) => e.preventDefault());

    // Função debounce para atrasar a atualização da pesquisa
    this._debounceSearch = debounce((fieldValue, checkboxChecked, focused) => {
      this.showExtraFilters = fieldValue || checkboxChecked || focused;
      // Espera 1ms → permite mudar do campo para checkbox usando Tab
    }, 1);
  }

  // Quando o campo recebe foco
  _onFieldFocus(e) {
    if (e.currentTarget.id === 'field') {
      this.dispatchEvent(
        new Event('search-focus', { bubbles: true, composed: true })
      );
    }
    this._focused = true;
  }

  // Quando o campo perde foco
  _onFieldBlur(e) {
    if (e.currentTarget.id === 'field') {
      this.dispatchEvent(
        new Event('search-blur', { bubbles: true, composed: true })
      );
    }
    this._focused = false;
  }
}

// Registra o componente customizado no navegador
customElements.define(SearchBar.is, SearchBar);

// Função utilitária debounce → executa a função com atraso controlado
function debounce(func, delay = 0) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}