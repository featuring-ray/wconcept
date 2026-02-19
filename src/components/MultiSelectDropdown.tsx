import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

interface MultiSelectDropdownProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

export function MultiSelectDropdown({
    label,
    options,
    selected,
    onChange,
    placeholder = '전체',
}: MultiSelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = options.filter(opt =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    const allSelected = selected.length === options.length;

    const toggle = (name: string) => {
        if (selected.includes(name)) {
            onChange(selected.filter(n => n !== name));
        } else {
            onChange([...selected, name]);
        }
    };

    const toggleAll = () => {
        if (allSelected) {
            onChange([]);
        } else {
            onChange([...options]);
        }
    };

    const buttonLabel = selected.length === 0
        ? placeholder
        : selected.length === options.length
            ? '전체'
            : `${selected.length}개 선택`;

    return (
        <div className="relative" ref={containerRef}>
            <span className="text-xs text-gray-400 mr-1.5">{label}</span>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${selected.length > 0 && selected.length < options.length
                        ? 'bg-blue-50 border-blue-400 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
            >
                {buttonLabel}
                {selected.length > 0 && selected.length < options.length && (
                    <span
                        className="ml-0.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center flex-shrink-0"
                    >
                        {selected.length}
                    </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Clear button */}
            {selected.length > 0 && selected.length < options.length && (
                <button
                    onClick={() => onChange([])}
                    className="ml-1 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                    title="필터 초기화"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-xl w-64 flex flex-col"
                    style={{ maxHeight: '320px' }}
                >
                    {/* Search */}
                    <div className="p-2 border-b flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="계정 검색..."
                            className="flex-1 text-xs outline-none text-gray-700 placeholder-gray-400"
                            autoFocus
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Select All */}
                    <button
                        onClick={toggleAll}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 border-b"
                    >
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${allSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`}>
                            {allSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                        전체 선택
                    </button>

                    {/* Options list */}
                    <div className="overflow-y-auto flex-1">
                        {filtered.length === 0 ? (
                            <p className="px-3 py-4 text-xs text-gray-400 text-center">검색 결과 없음</p>
                        ) : (
                            filtered.map(name => {
                                const isChecked = selected.includes(name);
                                return (
                                    <button
                                        key={name}
                                        onClick={() => toggle(name)}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-blue-50 transition-colors text-left"
                                    >
                                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                                            }`}>
                                            {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                                        </span>
                                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-300 to-orange-200 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                                            {name.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="text-gray-700 truncate">{name}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-3 py-2 border-t text-xs text-gray-400 text-right">
                        {selected.length === 0 ? '전체' : `${selected.length} / ${options.length}개 선택됨`}
                    </div>
                </div>
            )}
        </div>
    );
}
