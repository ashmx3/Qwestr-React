import firebase from 'firebase';
import {
  createQwest,
  completeQwest,
  restartQwest,
  assignQwest,
  acceptQwest,
  rejectQwest,
  revokeQwest,
  dropQwest,
  removeQwest,
  deleteQwest,
  getUserQwests
} from '../qwest';

afterEach(() => {
  firebase.__resetAuthUserId();
  firebase.__clearMockDatabase();
})

it('successfully creates a Qwest', () => {
  // Get authorized User ID
  const currentAuthUserId = firebase.__getAuthUserId();

  // Create Qwest data object
  const qwestData = {
    title: 'Test Qwest'
  };

  // Create the Qwest
  createQwest(qwestData);

  // Get resulting database
  const database = firebase.__getMockDatabase();

  // Expect that the approriate Qwests have been created/ updated
  expect(Object.keys(database['qwests'])).toHaveLength(1);
  expect(database['qwests']['mockId1'].title).toBe('Test Qwest');
  expect(database['qwests']['mockId1'].createdBy).toBe(currentAuthUserId);

  // Expect that the approriate User Qwests have been created/ updated
  expect(Object.keys(database['user-qwests'])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId]['active'])).toHaveLength(1);
  expect(database['user-qwests'][currentAuthUserId]['active']['mockId1'].title).toBe('Test Qwest');
});

it('successfully completes a Qwest', () => {
  // Get authorized User ID
  const currentAuthUserId = firebase.__getAuthUserId();

  // Create Qwest data object
  const qwestData = {
    title: 'Test Qwest'
  };

  // Create the Qwest
  createQwest(qwestData);

  // Complete the Qwest
  completeQwest(qwestData, 'mockId1');

  // Get resulting database
  const database = firebase.__getMockDatabase();

  // Expect that the approriate Qwests have been created/ updated
  expect(Object.keys(database['qwests'])).toHaveLength(1);
  expect(database['qwests']['mockId1'].completed).toBeTruthy();

  // Expect that the approriate User Qwests have been created/ updated
  expect(Object.keys(database['user-qwests'])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId]['completed'])).toHaveLength(1);
});

it('successfully restarts a Qwest', () => {
  // Get authorized User ID
  const currentAuthUserId = firebase.__getAuthUserId();

  // Create Qwest data object
  const qwestData = {
    title: 'Test Qwest'
  };

  // Create the Qwest
  createQwest(qwestData);

  // Complete the Qwest
  completeQwest(qwestData, 'mockId1');

  // Rdstart the Qwest
  restartQwest(qwestData, 'mockId1');

  // Get resulting database
  const database = firebase.__getMockDatabase();

  // Expect that the approriate Qwests have been created/ updated
  expect(Object.keys(database['qwests'])).toHaveLength(1);
  expect(database['qwests']['mockId1'].completed).toBeFalsy();

  // Expect that the approriate User Qwests have been created/ updated
  expect(Object.keys(database['user-qwests'])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId]['active'])).toHaveLength(1);
});

it('successfully assigns a Qwest', () => {
  // Get authorized User ID
  const currentAuthUserId = firebase.__getAuthUserId();

  // Create test assigning User ID
  const assigningUserId = 'testUserId';

  // Create Qwest data object
  const qwestData = {
    title: 'Test Qwest'
  };

  // Create the Qwest
  createQwest(qwestData);

  // Assign the Qwest
  assignQwest(qwestData, 'mockId1', assigningUserId);

  // Get resulting database
  const database = firebase.__getMockDatabase();

  // Expect that the approriate Qwests have been created/ updated
  expect(Object.keys(database['qwests'])).toHaveLength(1);
  expect(database['qwests']['mockId1'].assignedTo).toBe(assigningUserId);

  // Expect that the approriate User Qwests have been created/ updated
  expect(Object.keys(database['user-qwests'])).toHaveLength(2);
  expect(Object.keys(database['user-qwests'][currentAuthUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId]['assigned'])).toHaveLength(1);
  expect(database['user-qwests'][currentAuthUserId]['assigned']['mockId1'].assignedTo).toBe(assigningUserId);
  expect(Object.keys(database['user-qwests'][assigningUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][assigningUserId]['pending'])).toHaveLength(1);
  expect(database['user-qwests'][assigningUserId]['pending']['mockId1'].assignedBy).toBe(currentAuthUserId);
});

it('successfully accepts a Qwest', () => {
  // Get authorized User ID
  const currentAuthUserId = firebase.__getAuthUserId();

  // Create test assigning User ID
  const assigningUserId = 'testUserId';

  // Create Qwest data objects
  const qwestData = {
    title: 'Test Qwest'
  };

  const assignedQwestData = {
    title: 'Test Qwest',
    assignedBy: currentAuthUserId
  };

  // Create the Qwest
  createQwest(qwestData);

  // Assign the Qwest
  assignQwest(qwestData, 'mockId1', assigningUserId);

  // set the authorized User ID to the assigning User
  firebase.__setAuthUserId(assigningUserId);

  // Accept the Qwest
  acceptQwest(assignedQwestData, 'mockId1');

  // Get resulting database
  const database = firebase.__getMockDatabase();

  // Expect that the approriate Qwests have been created/ updated
  expect(Object.keys(database['qwests'])).toHaveLength(1);

  // Expect that the approriate User Qwests have been created/ updated
  expect(Object.keys(database['user-qwests'])).toHaveLength(2);
  expect(Object.keys(database['user-qwests'][currentAuthUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId]['assigned'])).toHaveLength(1);
  expect(database['user-qwests'][currentAuthUserId]['assigned']['mockId1'].assignedTo).toBe(assigningUserId);
  expect(Object.keys(database['user-qwests'][assigningUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][assigningUserId]['active'])).toHaveLength(1);
  expect(database['user-qwests'][assigningUserId]['active']['mockId1'].assignedBy).toBe(currentAuthUserId);
});

it('successfully rejects a Qwest', () => {
  // Get authorized User ID
  const currentAuthUserId = firebase.__getAuthUserId();

  // Create test assigning User ID
  const assigningUserId = 'testUserId';

  // Create Qwest data objects
  const qwestData = {
    title: 'Test Qwest'
  };

  const assignedQwestData = {
    title: 'Test Qwest',
    assignedBy: currentAuthUserId
  };

  // Create the Qwest
  createQwest(qwestData);

  // Assign the Qwest
  assignQwest(qwestData, 'mockId1', assigningUserId);

  // set the authorized User ID to the assigning User
  firebase.__setAuthUserId(assigningUserId);

  // Reject the Qwest
  rejectQwest(assignedQwestData, 'mockId1');

  // Get resulting database
  const database = firebase.__getMockDatabase();

  // Expect that the approriate Qwests have been created/ updated
  expect(Object.keys(database['qwests'])).toHaveLength(1);
  expect(database['qwests']['mockId1'].assignedTo).toBeFalsy();

  // Expect that the approriate User Qwests have been created/ updated
  expect(Object.keys(database['user-qwests'])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId]['active'])).toHaveLength(1);
});

it('successfully revokes a Qwest', () => {
  // Get authorized User ID
  const currentAuthUserId = firebase.__getAuthUserId();

  // Create test assigning User ID
  const assigningUserId = 'testUserId';

  // Create Qwest data objects
  const qwestData = {
    title: 'Test Qwest'
  };

  const assigningQwestData = {
    title: 'Test Qwest',
    assignedTo: assigningUserId
  };

  const assignedQwestData = {
    title: 'Test Qwest',
    assignedBy: currentAuthUserId
  };

  // Create the Qwest
  createQwest(qwestData);

  // Assign the Qwest
  assignQwest(qwestData, 'mockId1', assigningUserId);

  // set the authorized User ID to the assigning User
  firebase.__setAuthUserId(assigningUserId);

  // Accept the Qwest
  acceptQwest(assignedQwestData, 'mockId1');

  // set the authorized User ID back to the original User
  firebase.__setAuthUserId(currentAuthUserId);

  // Revoke the Qwest
  revokeQwest(assigningQwestData, 'mockId1');

  // Get resulting database
  const database = firebase.__getMockDatabase();

  // Expect that the approriate Qwests have been created/ updated
  expect(Object.keys(database['qwests'])).toHaveLength(1);
  expect(database['qwests']['mockId1'].assignedTo).toBeFalsy();

  // Expect that the approriate User Qwests have been created/ updated
  expect(Object.keys(database['user-qwests'])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId]['active'])).toHaveLength(1);
});

it('successfully drops a Qwest', () => {
  // Get authorized User ID
  const currentAuthUserId = firebase.__getAuthUserId();

  // Create test assigning User ID
  const assigningUserId = 'testUserId';

  // Create Qwest data objects
  const qwestData = {
    title: 'Test Qwest'
  };

  const assignedQwestData = {
    title: 'Test Qwest',
    assignedBy: currentAuthUserId
  };

  // Create the Qwest
  createQwest(qwestData);

  // Assign the Qwest
  assignQwest(qwestData, 'mockId1', assigningUserId);

  // set the authorized User ID to the assigning User
  firebase.__setAuthUserId(assigningUserId);

  // Accept the Qwest
  acceptQwest(assignedQwestData, 'mockId1');

  // Drop the Qwest
  dropQwest(assignedQwestData, 'mockId1');

  // Get resulting database
  const database = firebase.__getMockDatabase();

  // Expect that the approriate Qwests have been created/ updated
  expect(Object.keys(database['qwests'])).toHaveLength(1);
  expect(database['qwests']['mockId1'].assignedTo).toBeFalsy();

  // Expect that the approriate User Qwests have been created/ updated
  expect(Object.keys(database['user-qwests'])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId]['active'])).toHaveLength(1);
});

it('successfully removes a Qwest', () => {
  // Get authorized User ID
  const currentAuthUserId = firebase.__getAuthUserId();

  // Create test assigning User ID
  const assigningUserId = 'testUserId';

  // Create Qwest data objects
  const qwestData = {
    title: 'Test Qwest'
  };

  const assignedQwestData = {
    title: 'Test Qwest',
    assignedBy: currentAuthUserId,
    assignedTo: assigningUserId
  };

  // Create the Qwest
  createQwest(qwestData);

  // Assign the Qwest
  assignQwest(qwestData, 'mockId1', assigningUserId);

  // set the authorized User ID to the assigning User
  firebase.__setAuthUserId(assigningUserId);

  // Accept the Qwest
  acceptQwest(assignedQwestData, 'mockId1');

  // Complete the Qwest
  completeQwest(assignedQwestData, 'mockId1');

  // Remove the Qwest
  removeQwest('mockId1');

  // Get resulting database
  const database = firebase.__getMockDatabase();

  // Expect that the approriate Qwests have been created/ updated
  expect(Object.keys(database['qwests'])).toHaveLength(1);
  expect(database['qwests']['mockId1'].assignedTo).toBeTruthy();

  // Expect that the approriate User Qwests have been created/ updated
  expect(Object.keys(database['user-qwests'])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId])).toHaveLength(1);
  expect(Object.keys(database['user-qwests'][currentAuthUserId]['completed'])).toHaveLength(1);
});

it('successfully deletes a Qwest', () => {
  // Create Qwest data object
  const qwestData = {
    title: 'Test Qwest'
  };

  // Create the Qwest
  createQwest(qwestData);

  // Delete the Qwest
  deleteQwest(qwestData, 'mockId1');

  // Get resulting database
  const database = firebase.__getMockDatabase();

  // Expect that the approriate Qwests have been deleted
  expect(database['qwests']).toBeFalsy();

  // Expect that the approriate User Qwests have been deleted
  expect(database['user-qwests']).toBeFalsy();
});

it('successfully returns a list of User Qwests', () => {
  // Create Qwest data object.
  const qwestData = {
    title: 'Test Qwest'
  };

  // Create the Qwest
  createQwest(qwestData);

  // Get list of User Qwests
  let result = null;
  getUserQwests((data) => {
    result = data.val();
  });

  // Expect that the correct list of User Qwests has been returned
  expect(Object.keys(result)).toHaveLength(1);
  expect(Object.keys(result['active'])).toHaveLength(1);
});
