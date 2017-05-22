import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import sinonChai from 'sinon-chai';
import template from '../../partials/favorite-button.html';
import toggleFavorite, {
  ACTIVE_CLASS,
  VISUAL_HIDDEN_CLASS,
  MODAL_CLASS,
  EVENT_NAME,
} from './toggle-favorite';

chai.use(chaiJquery);
chai.use(sinonChai);

describe('Toggle Favorite', () => {
  let sandbox;

  const $getModal = () => $(fixture.el).find(`.${MODAL_CLASS}`);

  const setup = (options = {}) => {
    const favoriteMessage = 'like me!';
    const unfavoriteMessage = 'fine, whatever';
    const favoriteNotification = 'oh wow, you really like me!';
    const unfavoriteNotification = 'bah, I do not like you anyways!';
    const $button = $(fixture.set(template({
      'favorite-message': favoriteMessage,
      'unfavorite-message': unfavoriteMessage,
      'favorite-notification': favoriteNotification,
      'unfavorite-notification': unfavoriteNotification,
    })));

    const modal = sandbox.spy();
    const container = fixture.el;
    toggleFavorite($button[0], Object.assign({ modal, container }, options));

    return {
      $button,
      favoriteMessage,
      unfavoriteMessage,
      favoriteNotification,
      unfavoriteNotification,
      modal,
    };
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    $(`.${MODAL_CLASS}`).remove();
    sandbox.restore();
    fixture.cleanup();
  });

  it('should add an active class when button has been clicked', () => {
    const { $button, unfavoriteMessage } = setup();
    $button.trigger('click');
    expect($button).to.have.class(ACTIVE_CLASS);
    expect($button.find(`.${VISUAL_HIDDEN_CLASS}`)).to.have.text(unfavoriteMessage);
  });

  it('should remove an active class when an active button has been clicked', () => {
    const { $button, favoriteMessage } = setup();
    $button.addClass(ACTIVE_CLASS);
    $button.trigger('click');
    expect($button).to.not.have.class(ACTIVE_CLASS);
    expect($button.find(`.${VISUAL_HIDDEN_CLASS}`)).to.have.text(favoriteMessage);
  });

  it('should show the favorite message by default', () => {
    const { $button, favoriteMessage } = setup();
    expect($button.find(`.${VISUAL_HIDDEN_CLASS}`)).to.have.text(favoriteMessage);
  });

  it('should show the favorite notification', () => {
    const { $button, favoriteNotification } = setup();
    $button.trigger('click');
    expect($getModal().html()).to.contain(favoriteNotification);
  });

  it('should show the unfavorite notification when already favorited', () => {
    const { $button, unfavoriteNotification } = setup();
    $button
      .addClass(ACTIVE_CLASS)
      .trigger('click');
    expect($getModal().html()).to.contain(unfavoriteNotification);
  });

  it('should listen for a favorite event', () => {
    const { $button } = setup();
    const spy = sandbox.spy();
    $button.on(EVENT_NAME, spy);

    $button.trigger('click');
    expect(spy).to.have.been.calledWith(sinon.match({
      detail: {
        favorited: true,
      },
    }));

    $button.trigger('click');
    expect(spy).to.have.been.calledWith(sinon.match({
      detail: {
        favorited: false,
      },
    }));
    expect(spy).to.have.been.calledTwice;
  });
});
