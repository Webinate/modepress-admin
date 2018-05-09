import Module from "./module";
import { Page } from 'puppeteer';

/**
 * A module for interacting with a category container
 */
export default class CategoryModule extends Module {
  constructor( page: Page ) {
    super( page );
  }

  /**
   * Open the new category form
   */
  async openCategoryForm() {
    await this.page.click( '.mt-new-category-btn' );
    await this.page.waitFor( '.mt-category-form' );
    await this.page.$eval( '.mt-approve-category-form', ( elm: HTMLElement ) => elm.scrollIntoView() );
  }

  categoriesLoaded() {
    return this.page.waitForFunction( 'document.querySelector(".mt-cat-loading") == null' );
  }

  getTags() {
    return this.page.$$eval( '.mt-tag-chip span', list => Array.from( list ).map( elm => elm.textContent ) );
  }

  async addTag( tag: string ) {
    await this.page.waitFor( '#mt-add-tag' );
    await this.page.focus( '#mt-add-new-tag' );
    await this.page.type( 'input#mt-add-new-tag', tag, { delay: 10 } );
    await this.page.click( '#mt-add-tag' );
  }

  /**
   * Close the category form either by cancelling or approving
   */
  async closeCategoryForm( approve = false ) {
    if ( approve ) {
      await this.page.click( '.mt-approve-category-form' );
      await this.page.waitFor( '.mt-new-category-btn' );
      await this.categoriesLoaded()

      // Close snackbar
      await this.page.click( '.mt-response-message button' );
    }
    else {
      await this.page.click( '.mt-cancel-category-form' );
      await this.page.waitFor( '.mt-new-category-btn' );
    }
  }

  async confirmDeletion( cancel = false ) {
    await this.page.waitFor( '.mt-confirm-delcat button' );
    if ( cancel )
      await this.page.click( '.mt-cancel-delcat button' );
    else
      await this.page.click( '.mt-confirm-delcat button' );

    await this.page.waitForFunction( 'document.querySelector(".mt-category-del-container") == null' );
  }

  /**
   * Returns the menu items of the parent drop down
   */
  async getParentCategories() {
    const dropdownSelector = '#mt-new-cat-parent > div';
    const menuItems = 'div[role=menu] div span[role=menuitem]';
    await this.page.waitFor( dropdownSelector );
    await this.page.click( dropdownSelector );
    await this.page.waitFor( 500 );
    const items: string[] = await this.page.$$eval( menuItems, list => {
      return Array.from( list ).map( elm => elm.textContent );
    } );

    await this.page.waitFor( 'body div:last-child' );
    await this.page.click( 'body div:last-child' );

    return items;
  }

  /**
   * Returns an array of category names
   */
  async getCategories( type: 'all' | 'selected' = 'all' ) {
    await this.categoriesLoaded();

    let categoriesSelector = '';
    if ( type === 'all' )
      categoriesSelector = '.mt-category-checkbox';
    else
      categoriesSelector = '.mt-category-checkbox.selected';

    const items: string[] = await this.page.$$eval( categoriesSelector, list => {
      return Array.from( list ).map( elm => elm.textContent );
    } );

    return items;
  }

  /**
   * Selects a category by its name
   */
  async selectCategories( name: string ) {
    let categoriesSelector = '.mt-category-checkbox';

    const items: string[] = await this.page.$$eval( categoriesSelector, list => {
      return Array.from( list ).map( elm => elm.textContent );
    } );

    const index = items.indexOf( name );
    if ( index === -1 )
      throw new Error( 'No category exists with that label' );

    await this.page.$$eval( '.mt-category-checkbox input', ( list, index: number ) => {
      ( list[ index ] as HTMLElement ).click()
    }, index );

    return items;
  }

  /**
   * Selects a parent category by its label
   */
  async selectParent( p: string ) {
    const dropdownSelector = '#mt-new-cat-parent button';
    const menuItems = 'div[role=menu] div span[role=menuitem]';

    await this.page.waitFor( 500 );
    await this.page.waitFor( dropdownSelector );
    await this.page.click( dropdownSelector );

    const items: string[] = await this.page.$$eval( menuItems, list => {
      return Array.from( list ).map( elm => elm.textContent );
    } );

    const index = items.indexOf( p );
    if ( index === -1 )
      throw new Error( 'No menu item exists with that label' );

    await this.page.click( `div[role=menu] div:nth-child(${ index + 1 }) span[role=menuitem]` );
  }

  /**
   * Enter or exit category delete mode
   */
  async deleteMode( open = true ) {
    if ( open ) {
      await this.page.click( '.mt-remove-category-btn' );
      await this.page.waitFor( '.mt-cancel-category-delete' );
    }
    else {
      await this.page.click( '.mt-cancel-category-delete' );
      await this.page.waitFor( '.mt-remove-category-btn' );
    }
  }

  /**
   * Gets or sets the name of the category in the form
   */
  name( val?: string ) { return this.input( '#mt-new-cat-name', val ) }

  /**
   * Gets or sets the slug of the category in the form
   */
  slug( val?: string ) { return this.input( '#mt-new-cat-slug', val ) }

  /**
   * Gets or sets the description of the category in the form
   */
  description( val?: string ) { return this.input( '#mt-new-cat-desc', val ) }

  /**
   * Gets the last reported category error
   */
  async getCategoryErrorMsg() {
    const errorSelector = '.mt-newcat-error';
    await this.page.waitFor( errorSelector );
    return this.page.$eval( errorSelector, ( elm: HTMLElement ) => elm.textContent );
  }

}