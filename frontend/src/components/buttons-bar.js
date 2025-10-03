import { html, css, LitElement } from 'lit';

// Cria um novo componente web chamado "ButtonsBarElement"
class ButtonsBarElement extends LitElement {
  // Define os estilos CSS que serão aplicados apenas dentro do componente
  static get styles() {
    return css`
      :host {
        /* Configurações gerais do container do componente */
        flex: none;
        display: flex;
        flex-wrap: wrap;
        transition: box-shadow 0.2s;
        justify-content: space-between;
        padding-top: var(--lumo-space-s);
        align-items: baseline;
        box-shadow: 0 -3px 3px -3px var(--lumo-shade-20pct);
      }

      /* Quando o atributo "no-scroll" está presente, remove a sombra */
      :host([no-scroll]) {
        box-shadow: none;
      }

      /* Estiliza o slot 'info' ou o elemento com a classe .info */
      :host ::slotted([slot='info']),
      .info {
        text-align: right;
        flex: 1;
      }

      /* Define margens para botões dentro do componente */
      ::slotted(vaadin-button) {
        margin: var(--lumo-space-xs);
      }

      /* Ajustes de layout para telas pequenas */
      @media (max-width: 600px) {
        :host ::slotted([slot='info']) {
          order: -1;        /* Move o "info" para cima */
          min-width: 100%;  /* Ocupa largura total */
          flex-basis: 100%;
        }
      }
    `;
  }

  // Renderiza a estrutura HTML do componente
  render() {
    return html`
      <!-- Slot para conteúdo do lado esquerdo -->
      <slot name="left"></slot>

      <!-- Slot para informações, com fallback para uma div vazia -->
      <slot name="info"><div class="info"></div></slot>

      <!-- Slot para conteúdo do lado direito -->
      <slot name="right"></slot>
    `;
  }

  // Nome que será usado para chamar este componente no HTML
  static get is() {
    return 'buttons-bar';
  }
}

// Registra o novo elemento customizado no navegador
customElements.define(ButtonsBarElement.is, ButtonsBarElement);