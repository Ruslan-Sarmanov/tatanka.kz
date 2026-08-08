export default function Footer() {
  return (
    <footer className="mt-16 border-t border-leather-100 bg-leather-50">
      <div className="container-page flex flex-col gap-2 py-8 text-sm text-leather-600 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} TATANKA.KZ — аксессуары из натуральной кожи ручной работы.</p>
        <p>Изготовление под заказ · Казахстан</p>
      </div>
    </footer>
  );
}
