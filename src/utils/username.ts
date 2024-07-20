import { animals, adjectives } from "./usernames.json";

const generateUsername = () => {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

  // 4 digit random number
  const randomHash = Math.floor(1000 + Math.random() * 9000);

  return `${randomAdjective}${randomAnimal}#${randomHash}`;
};

export default generateUsername;
