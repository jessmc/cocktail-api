import { useState, type FormEvent } from 'react';
import styles from "./SearchForm.module.scss";


interface SearchFormProps {
    label: string;
    onSearch: (value: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export default function SearchForm({ 
        label,
        onSearch, 
        placeholder = "search...",
        isLoading = false,
    }: SearchFormProps)  {
    const [query, setQuery] = useState("");

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSearch(query.trim());
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label>
                <span className="sr-only">{label}</span>
                <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className={styles.input}
                />
            </label>

            <button
            type="submit"
            className={styles.button}
            disabled={isLoading || !query.trim()}
            >

                {isLoading ? "Searching…" : "Search"}

            </button>
        </form>
    );
}