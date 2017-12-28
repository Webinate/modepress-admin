const UsersPage = require( '../../pages/users' );
const assert = require( 'assert' );
const utils = require( '../../utils' );

let users = new UsersPage();
let registeredUser;

describe( '4. Resend Activation', function() {
  before( async () => {
    const agent = await utils.refreshAdminToken();
    registeredUser = await utils.createAgent( 'RegisteredUser', 'registered333@test.com', 'password', true );
    await users.load( agent );
    assert( await users.$( '.mt-user-list' ) );
  } )

  it( 'it should show a message that an email was sent', async () => {
    await users.selectUser( 'registered333@test.com' );
    await users.clickDrawer( 'Account Settings' );
    await users.waitFor( '.mt-resend-activation' );
    await users.click( '.mt-resend-activation' );
    assert.equal( await users.getSnackMessage(), 'An activation link has been sent, please check your email for further instructions' );
  } );
} );