import { useState, useRef, useEffect, type FormEvent } from 'react';
import styles from "./SearchForm.module.scss";

type SearchType = "name" | "ingredient";

interface SearchFormProps {
  onSearch: (value: string, type: SearchType) => void;
  isLoading?: boolean;
  nameValue: string;
  ingredientValue: string;
  activeType: SearchType;
}

export default function SearchForm({
    onSearch,
    isLoading = false,
    nameValue,
    ingredientValue,
    activeType,
}: SearchFormProps) {
    const [type, setType] = useState<SearchType>(activeType); // this is name or ingredient
    const [draft, setDraft] = useState(activeType === "name" ? nameValue : ingredientValue); // the temporary keystrokes to be searched on handleSubmit

    const nameRef = useRef<HTMLButtonElement>(null);
    const ingredientRef = useRef<HTMLButtonElement>(null);
    const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});


    // Sync when URL changes (back/forward)
    useEffect(() => {
        setType(activeType); // name or ingredient toggle value
        setDraft(activeType === "name" ? nameValue : ingredientValue); // value of the search input
    }, [activeType, nameValue, ingredientValue]);

    useEffect(() => {
        const activeRef = type === "name" ? nameRef : ingredientRef;
        const btn = activeRef.current;
        if (btn) {
            setSliderStyle({
                width: btn.offsetWidth,
                transform: `translateX(${btn.offsetLeft}px)`,
            });
        }
    }, [type]);

    // change the toggle value
    function handleToggle(next: SearchType) {
        setType(next);
        setDraft(next === "name" ? nameValue : ingredientValue);
    }

    // submit the search form
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSearch(draft.trim(), type);
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.bar}>
                <div className={styles.toggle}>
                    <div className={styles.toggleSlider} style={sliderStyle} />
                        <button
                            ref={nameRef}
                            type="button"
                            className={`${styles.toggleBtn} ${type === "name" ? styles.active : ""}`}
                            onClick={() => handleToggle("name")}
                        >
                            Name
                        </button>
                        <button
                            ref={ingredientRef}
                            type="button"
                            className={`${styles.toggleBtn} ${type === "ingredient" ? styles.active : ""}`}
                            onClick={() => handleToggle("ingredient")}
                        >
                            Ingredient
                        </button>
                    </div>

                <div className={styles.divider} />

                {/* input field */}
                <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={type === "name" ? "Margarita..." : "Gin..."}
                    className={styles.input}
                />

                {/* submit button */}
                <button
                    type="submit"
                    className={styles.submit}
                    disabled={isLoading || !draft.trim()}
                >
                    {isLoading ? "…" : "Search"}
                </button>
            </div>
        </form>
    );
}