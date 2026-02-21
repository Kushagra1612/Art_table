import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { getArtworks } from "../api/artworks";
import { Artwork } from "../types/artwork";
import SelectOverlay from "./SelectOverlay";

const ROWS = 12;

const ArtworkTable: React.FC = () => {
  const [rows, setRows] = useState<Artwork[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getArtworks(page, ROWS);
        setRows(res.data);
        setTotal(res.pagination.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page]);

  const selectedRows = useMemo(
    () => rows.filter((r) => selectedIds.has(r.id)),
    [rows, selectedIds]
  );

  const handleSelectionChange = (e: any) => {
    const currentIds = new Set(rows.map((r) => r.id));
    const checked = new Set(e.value.map((r: Artwork) => r.id));

    setSelectedIds((prev) => {
      const next = new Set(prev);

      currentIds.forEach((id) => {
        if (checked.has(id)) next.add(id);
        else next.delete(id);
      });

      return next;
    });
  };

  const handleCustomSelect = (count: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      rows.slice(0, count).forEach((r) => next.add(r.id));
      return next;
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Art Institute of Chicago</h2>
          <p style={{ fontSize: 13, color: "#777" }}>
            {total.toLocaleString()} artworks · Page {page}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {selectedIds.size > 0 && (
            <Button
              label={`Clear (${selectedIds.size})`}
              className="p-button-outlined p-button-danger p-button-sm"
              onClick={() => setSelectedIds(new Set())}
            />
          )}

          <SelectOverlay max={rows.length} onConfirm={handleCustomSelect} />
        </div>
      </div>

      <div style={{ position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(255,255,255,0.6)",
              zIndex: 10,
            }}
          >
            <ProgressSpinner />
          </div>
        )}

        <DataTable
          value={rows}
          dataKey="id"
          selectionMode="multiple"
          selection={selectedRows}
          onSelectionChange={handleSelectionChange}
          paginator
          lazy
          rows={ROWS}
          totalRecords={total}
          first={(page - 1) * ROWS}
          onPage={(e) => setPage((e.page ?? 0) + 1)}
        >
          <Column selectionMode="multiple" style={{ width: "3rem" }} />
          <Column field="title" header="Title" />
          <Column field="artist_display" header="Artist" />
          <Column field="place_of_origin" header="Origin" />
        </DataTable>
      </div>

      {selectedIds.size > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>Selected ({selectedIds.size})</h4>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Array.from(selectedIds).map((id) => (
              <Tag
                key={id}
                onClick={() =>
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  })
                }
                style={{ cursor: "pointer" }}
              >
                ID {id} ×
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkTable;