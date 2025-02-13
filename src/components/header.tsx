import Link from 'next/link';

function Header() {
  return (
    <header className='flex h-[68px] items-center bg-darkBrown'>
      <div className='ml-4 text-3xl text-[#ffffff]'>Meet Pie</div>
      <Link href='/' className='ml-10 text-[#ffffff]'>
        Home
      </Link>
      <Link href='/attendance' className='ml-4 text-[#ffffff]'>
        出欠表
      </Link>
      <Link href='/register' className='ml-4 text-[#ffffff]'>
        出欠表作成画面
      </Link>
    </header>
  );
}

export default Header;
