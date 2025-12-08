import Header from '../Header';

export default function HeaderExample() {
  return (
    <Header
      onHistoryClick={() => console.log('History clicked')}
      showBackButton={false}
    />
  );
}
