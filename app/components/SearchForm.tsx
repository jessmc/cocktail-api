import { useState, type FormEvent, useEffect } from 'react';
import styles from "./SearchForm.module.scss";


interface SearchFormProps {
  label: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  value: string;
}

export default function SearchForm({
    label,
    onSearch,
    placeholder = "search...",
    isLoading = false,
    value,
    }: SearchFormProps) {
    // Local draft state for typing
    const [draft, setDraft] = useState(value);

    // Keep draft in sync when URL value changes (back/forward, reload)
    useEffect(() => {
        setDraft(value);
    }, [value]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSearch(draft.trim());
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label>
                <span className="sr-only">{label}</span>
                <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={placeholder}
                    className={styles.input}
                />
            </label>

            <button
                type="submit"
                className={styles.button}
                disabled={isLoading || !draft.trim()}
            >

                {isLoading ? "Searching…" : "Search"}

            </button>
        </form>
    );
}