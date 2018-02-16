import { ActionCreator } from '../actions-creator';
import { Page, IUserEntry } from 'modepress';
import { users } from 'modepress/lib-frontend';
import { IRootState } from '../';
import { ActionCreators as AppActionCreators } from '../app/actions';

// Action Creators
export const ActionCreators = {
  SetUsersBusy: new ActionCreator<'users-busy', boolean>( 'users-busy' ),
  SetPrepopulated: new ActionCreator<'users-set-prepopulated', boolean>( 'users-set-prepopulated' ),
  SetUsers: new ActionCreator<'users-set-users', Page<IUserEntry> | null>( 'users-set-users' ),
  RemoveUser: new ActionCreator<'users-remove-user', string>( 'users-remove-user' )
};

// Action Types
export type Action = typeof ActionCreators[ keyof typeof ActionCreators ];

/**
 * Refreshes the user state
 */
export function getUsers( index: number = 0, search?: string ) {
  return async function( dispatch: Function, getState: () => IRootState ) {
    dispatch( ActionCreators.SetUsersBusy.create( true ) );
    const resp = await users.getAll( { index: index, search: search } );
    dispatch( ActionCreators.SetUsers.create( resp ) );
    dispatch( ActionCreators.SetPrepopulated.create( false ) );
  }
}

/**
 * Refreshes the user state
 */
export function removeUser( username: string ) {
  return async function( dispatch: Function, getState: () => IRootState ) {
    try {
      dispatch( ActionCreators.SetUsersBusy.create( true ) );
      await users.remove( username );
      dispatch( ActionCreators.RemoveUser.create( username ) );
      dispatch( AppActionCreators.serverResponse.create( `User '${ username }' successfully removed` ) );
    }
    catch {
      dispatch( ActionCreators.SetUsersBusy.create( true ) );
    }
  }
}