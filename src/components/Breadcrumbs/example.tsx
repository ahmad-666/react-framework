import Link from 'next/link';
import Breadcrumbs from '.';

export default function BreadcrumbsExample() {
    const items = [
        {
            route: '/',
            label: 'Home'
        },
        {
            route: '/category',
            label: 'Category'
        },
        {
            route: '/category/item',
            label: 'Item',
            disabled: true
        }
    ];

    return (
        <div>
            <Breadcrumbs
            // separate='>'
            >
                {items.map((item) => (
                    <Breadcrumbs.Item key={item.label}>
                        <Link
                            href={item.route}
                            className={`text-body-lg text-slate-600 ${item.disabled ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            {item.label}
                        </Link>
                    </Breadcrumbs.Item>
                ))}
            </Breadcrumbs>
        </div>
    );
}
