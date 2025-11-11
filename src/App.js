import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];
export default function App() {
  const [friends, setFriends] = useState(initialFriends);

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend() {
    setShowAddFriend((show) => !show);
  }
  function handleSelection(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
  }
  function AddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend ? <AddFriendForm onAddFriend={AddFriend} /> : null}
        <Button onClick={handleAddFriend}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>
      {selectedFriend ? (
        <FormSplitBill selectedFriend={selectedFriend} />
      ) : null}
    </div>
  );
}
function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      <p className={friend.balance < 0 ? 'red' : ''}>
        {friend.balance < 0
          ? `You owe ${friend.name} ${Math.abs(friend.balance)}€`
          : ``}
      </p>
      <p className={friend.balance > 0 ? 'green' : ''}>
        {friend.balance > 0
          ? `${friend.name} owes you ${Math.abs(friend.balance)}€`
          : ''}
      </p>
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? 'close' : 'Select'}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48?u=499476');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName('');
    setImage('https://i.pravatar.cc/48?u=499476');
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🎇Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend }) {
  const [bill, setBill] = useState('');

  const [paidbyUser, setpaidbyUser] = useState('');
  const paidbyFriend = bill ? bill - paidbyUser : '';
  const [whoispaying, setwhoisPaying] = useState('user');

  return (
    <form className="form-split-bill">
      <h2>Split the bill with {selectedFriend.name}</h2>

      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍 your expense</label>
      <input
        type="text"
        value={paidbyUser}
        onChange={(e) =>
          setpaidbyUser(
            paidbyFriend > bill ? paidbyFriend : Number(e.target.value)
          )
        }
      />

      <labell>🙍🙍{selectedFriend.name} expense</labell>
      <input type="text" disabled value={paidbyFriend} />

      <label>🤑Who is paying the bill</label>
      <select
        value={whoispaying}
        onChange={(e) => setwhoisPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
