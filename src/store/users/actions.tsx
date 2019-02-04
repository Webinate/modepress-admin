import { ActionCreator } from '../actions-creator';
import { Page, IUserEntry } from '../../../../../src';
import { getAll, remove, update as updateUser, create as createUser } from '../../../../../src/lib-frontend/users';
import { IRootState } from '..';
import { ActionCreators as AppActionCreators } from '../app/actions';
import { ActionCreators as AppActions } from '../app/actions';

// Action Creators
export const ActionCreators = {
  SetUsersBusy: new ActionCreator<'users-busy', boolean>( 'users-busy' ),
  SetUsers: new ActionCreator<'users-set-users', Page<IUserEntry<'client' | 'expanded'>> | null>( 'users-set-users' ),
  UpdateUser: new ActionCreator<'users-update-user', IUserEntry<'client' | 'expanded'>>( 'users-update-user' ),
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
    const resp = await getAll( { index: index, search: search } );
    dispatch( ActionCreators.SetUsers.create( resp ) );
  }
}

export function update( id: string, token: Partial<IUserEntry<'client'>> ) {
  return async function( dispatch: Function, getState: () => IRootState ) {
    try {
      dispatch( ActionCreators.SetUsersBusy.create( true ) );
      const resp = await updateUser( id, token );
      dispatch( ActionCreators.UpdateUser.create( resp ) );
    }
    catch ( err ) {
      dispatch( ActionCreators.SetUsersBusy.create( false ) );
      dispatch( AppActions.serverResponse.create( err.message ) );
    }
  }
}

export function create( token: Partial<IUserEntry<'client'>>, onComplete: () => void ) {
  return async function( dispatch: Function, getState: () => IRootState ) {
    try {
      dispatch( ActionCreators.SetUsersBusy.create( true ) );
      await createUser( token );
      const resp = await getAll( { index: 0, search: '' } );
      dispatch( ActionCreators.SetUsers.create( resp ) );
      onComplete();
    }
    catch ( err ) {
      dispatch( ActionCreators.SetUsersBusy.create( false ) );
      dispatch( AppActions.serverResponse.create( err.message ) );
    }
  }
}

/**
 * Refreshes the user state
 */
export function removeUser( username: string ) {
  return async function( dispatch: Function, getState: () => IRootState ) {
    try {
      dispatch( ActionCreators.SetUsersBusy.create( true ) );
      await remove( username );
      dispatch( ActionCreators.RemoveUser.create( username ) );
      dispatch( AppActionCreators.serverResponse.create( `User '${ username }' successfully removed` ) );
    }
    catch {
      dispatch( ActionCreators.SetUsersBusy.create( true ) );
    }
  }
}