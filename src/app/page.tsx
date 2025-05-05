import Image from 'next/image';
import readdead from '../../src/app/img/red-dead-redemption_gbwz.png';

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-200">
      <Image src={readdead} alt="Red Dead Redemption" width={500} height={500} className="mb-4" />
      <h1 className="text-4xl font-bold">Trabalho Next</h1>
    </div>
  );
}