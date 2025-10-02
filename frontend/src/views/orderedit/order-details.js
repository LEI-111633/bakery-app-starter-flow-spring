import html from 'lit';
import css from 'lit';
import { LitElement } from 'lit';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';
import 'vaadin-icons/vaadin-icons.js';
import 'vaadin-button';
import 'vaadin-form-layout';
import 'vaadin-form-layout/vaadin-form-item.js';
import 'vaadin-icon';
import 'vaadin-icons';
import 'vaadin-text-field';
import '../../components/buttons-bar.js';
import ScrollShadowMixin from '../../components/utils-mixin.js';
import '../storefront/order-status-badge.js';
import sharedStyles from '../../../styles/shared-styles.js';

/**
 * OrderDetails component
 * Displays and manages order information, including customer data, products, history, and interactive elements.
 * Extends ScrollShadowMixin and LitElement for advanced UI features.
 */
class OrderDetails extends ScrollShadowMixin(LitElement) {
  /**
   * Returns combined styles, including shared styles and component-specific CSS.
   */
  static get styles() {
    return [sharedStyles, css`
      /* ...CSS omitted for brevity... */
      :host {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        flex: auto;
      }
      /* Additional CSS rules for layout and appearance */
    `];
  }

  /**
   * Returns the custom element tag name.
   * @returns {string}
   */
  static get is() {
    return 'order-details';
  }

  /**
   * Defines reactive properties for the component.
   * @returns {Object}
   */
  static get properties() {
    return {
      /** Order data model */
      item: { type: Object },
      /** Review mode flag */
      review: { type: Boolean },
      /** Responsive steps for form layouts */
      form1responsiveSteps: { type: Array },
      form2responsiveSteps: { type: Array },
      form3responsiveSteps: { type: Array },
      form4responsiveSteps: { type: Array }
    };
  }

  /**
   * Constructor initializes responsive steps for forms and sets up property defaults.
   */
  constructor() {
    super();
    // Define responsive layouts for multiple form sections
    this.form1responsiveSteps = [
      { columns: 1, labelsPosition: 'top' },
      { minWidth: '600px', columns: 4, labelsPosition: 'top' }
    ];
    this.form2responsiveSteps = [
      { columns: 1 },
      { minWidth: '180px', columns: 2 }
    ];
    this.form3responsiveSteps = [
      { columns: 1, labelsPosition: 'top' }
    ];
    this.form4responsiveSteps = [
      { columns: 1, labelsPosition: 'top' }
    ];
  }

  /**
   * Handles keydown events in the comment input field.
   * Sends the comment if Enter is pressed.
   * @param {KeyboardEvent} event
   */
  onCommentKeydown(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.shadowRoot.querySelector('#commentField').blur();
      this.shadowRoot.querySelector('#sendComment').click();
    }
  }

  /**
   * Renders the order details UI, including order status, customer info, product list, history, and actions.
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <div class="scrollable main-row" id="main">
        <div class="meta-row">
          <order-status-badge .status="${this.item.state}"></order-status-badge>
          <span class="dim">Order ${this.item.id}</span>
        </div>
        <vaadin-form-layout id="form1" .responsiveSteps="${this.form1responsiveSteps}">
          <vaadin-form-item>
            <label slot="label">Due</label>
            <h3>${this.item.formattedDueDate.day}</h3>
            <span class="dim">${this.item.formattedDueDate.weekday}</span>
          </vaadin-form-item>
          <vaadin-form-item>
            <label slot="label">Time</label>
            <h3>${this.item.formattedDueTime}</h3>
            <span class="dim">${this.item.pickupLocation.name}</span>
          </vaadin-form-item>
        </vaadin-form-layout>
        <vaadin-form-layout>
          <vaadin-form-item colspan="2">
            <label slot="label">Customer</label>
            <h3>${this.item.customer.fullName}</h3>
          </vaadin-form-item>
          <vaadin-form-item>
            <label slot="label">Phone number</label>
            <h3>${this.item.customer.phoneNumber}</h3>
          </vaadin-form-item>
        </vaadin-form-layout>
        ${when(this.item.customer.details, () => html`
          <vaadin-form-item label-position="top">
            <label slot="label">Additional details</label>
            <span>${this.item.customer.details}</span>
          </vaadin-form-item>
        `)}
        <vaadin-form-item>
          <label slot="label">Products</label>
          <div class="table products">
            ${map(this.item.items, item => html`
              <div class="tr">
                <div class="td product-name">
                  <div class="
