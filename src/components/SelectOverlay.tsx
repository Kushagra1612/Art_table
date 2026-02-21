import React, { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

type Props = {
  max: number;
  onConfirm: (count: number) => void;
};

const SelectOverlay: React.FC<Props> = ({ max, onConfirm }) => {
  const panelRef = useRef<OverlayPanel>(null);
  const [count, setCount] = useState<number | null>(null);

  const handleSelect = () => {
    if (!count || count < 1) return;

    onConfirm(Math.min(count, max));
    setCount(null);
    panelRef.current?.hide();
  };

  return (
    <>
      <Button
        label="Custom Select"
        icon="pi pi-list"
        className="p-button-outlined p-button-secondary"
        onClick={(e) => panelRef.current?.toggle(e)}
        disabled={max === 0}
      />

      <OverlayPanel ref={panelRef} showCloseIcon>
        <div style={{ width: 240 }}>
          <h4 style={{ marginBottom: 10 }}>Select rows on this page</h4>

          <InputNumber
            value={count}
            onValueChange={(e) => setCount(e.value ?? null)}
            min={1}
            max={max}
            placeholder={`1 – ${max}`}
            style={{ width: "100%", marginBottom: 12 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSelect();
            }}
            autoFocus
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button
              label="Cancel"
              className="p-button-text"
              onClick={() => panelRef.current?.hide()}
            />
            <Button label="Select" onClick={handleSelect} />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};

export default SelectOverlay;