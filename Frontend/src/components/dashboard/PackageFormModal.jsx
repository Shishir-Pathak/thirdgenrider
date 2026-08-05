import { Plus, Save, Trash2, X } from "lucide-react";
import DashboardButton from "./DashboardButton";
import Modal from "./Modal";
import { inputClass, labelClass } from "./bikeFormStyles";
import { emptyItineraryDay } from "../../hooks/usePackagesAdmin";

export default function PackageFormModal({
  open,
  mode,
  pkg,
  draft,
  onDraftChange,
  formError,
  submitting,
  imageInputRef,
  onClose,
  onSubmit,
}) {
  const isAdd = mode === "add";
  const onlyDigits = (value) => value.replace(/\D/g, "");

  const updateItinerary = (index, field, value) => {
    onDraftChange((d) => ({
      ...d,
      itinerary: d.itinerary.map((day, i) =>
        i === index ? { ...day, [field]: value } : day,
      ),
    }));
  };

  const addItineraryDay = () => {
    onDraftChange((d) => ({
      ...d,
      itinerary: [...d.itinerary, emptyItineraryDay(d.itinerary.length)],
    }));
  };

  const removeItineraryDay = (index) => {
    onDraftChange((d) => {
      if (d.itinerary.length <= 1) return d;
      return {
        ...d,
        itinerary: d.itinerary.filter((_, i) => i !== index),
      };
    });
  };

  const updateListItem = (key, index, value) => {
    onDraftChange((d) => ({
      ...d,
      [key]: d[key].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addListItem = (key) => {
    onDraftChange((d) => ({
      ...d,
      [key]: [...d[key], ""],
    }));
  };

  const removeListItem = (key, index) => {
    onDraftChange((d) => {
      if (d[key].length <= 1) return d;
      return {
        ...d,
        [key]: d[key].filter((_, i) => i !== index),
      };
    });
  };

  const renderListEditor = ({ keyName, title, placeholder }) => (
    <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <legend className="px-1 text-sm font-medium text-slate-700 dark:text-slate-300">
        {title}
      </legend>
      {draft[keyName].map((item, index) => (
        <div
          key={index}
          className="grid gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50 sm:grid-cols-[1fr_auto]"
        >
          <input
            className={inputClass}
            value={item}
            onChange={(e) => updateListItem(keyName, index, e.target.value)}
            placeholder={placeholder}
            required
            disabled={submitting}
          />
          <DashboardButton
            type="button"
            onClick={() => removeListItem(keyName, index)}
            disabled={submitting || draft[keyName].length <= 1}
            variant="secondary"
            size="sm"
            icon={Trash2}
          >
            Remove
          </DashboardButton>
        </div>
      ))}
      <DashboardButton
        type="button"
        onClick={() => addListItem(keyName)}
        disabled={submitting}
        variant="primary"
        size="sm"
        icon={Plus}
      >
        Add item
      </DashboardButton>
    </fieldset>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      titleId="package-form-title"
      title={isAdd ? "Add package" : "Edit package"}
      panelClassName="max-w-2xl"
      closeDisabled={submitting}
    >
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        {formError && (
          <p
            data-form-error
            tabIndex={-1}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
          >
            {formError}
          </p>
        )}

        <div>
          <label htmlFor="pkg-title" className={labelClass}>
            Title
          </label>
          <input
            id="pkg-title"
            className={inputClass}
            value={draft.title}
            onChange={(e) =>
              onDraftChange((d) => ({ ...d, title: e.target.value }))
            }
            placeholder="Kathmandu to Illam Tour Package"
            autoComplete="off"
            required
            disabled={submitting}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pkg-location" className={labelClass}>
              Location
            </label>
            <input
              id="pkg-location"
              className={inputClass}
              value={draft.location}
              onChange={(e) =>
                onDraftChange((d) => ({ ...d, location: e.target.value }))
              }
              placeholder="Illam"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pkg-duration-days" className={labelClass}>
                  Days
                </label>
                <input
                  id="pkg-duration-days"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={inputClass}
                  value={draft.durationDays}
                  onChange={(e) =>
                    onDraftChange((d) => ({
                      ...d,
                      durationDays: onlyDigits(e.target.value),
                    }))
                  }
                  placeholder="4"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label htmlFor="pkg-duration-nights" className={labelClass}>
                  Nights
                </label>
                <input
                  id="pkg-duration-nights"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={inputClass}
                  value={draft.durationNights}
                  onChange={(e) =>
                    onDraftChange((d) => ({
                      ...d,
                      durationNights: onlyDigits(e.target.value),
                    }))
                  }
                  placeholder="3"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pkg-group-size" className={labelClass}>
              Group size
            </label>
            <input
              id="pkg-group-size"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              className={inputClass}
              value={draft.groupSize}
              onChange={(e) =>
                onDraftChange((d) => ({ ...d, groupSize: e.target.value }))
              }
              placeholder="11"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="pkg-price" className={labelClass}>
              Price (Rs.)
            </label>
            <input
              id="pkg-price"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              className={inputClass}
              value={draft.price}
              onChange={(e) =>
                onDraftChange((d) => ({ ...d, price: e.target.value }))
              }
              placeholder="10000"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="pkg-experience" className={labelClass}>
            Package experience
          </label>
          <textarea
            id="pkg-experience"
            className={`${inputClass} min-h-28 resize-y`}
            value={draft.packageExperience}
            onChange={(e) =>
              onDraftChange((d) => ({
                ...d,
                packageExperience: e.target.value,
              }))
            }
            placeholder="Describe the overall experience for this package"
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="pkg-image" className={labelClass}>
            Image{" "}
            {!isAdd && (
              <span className="font-normal text-slate-500">
                (optional — leave empty to keep current)
              </span>
            )}
          </label>
          <input
            id="pkg-image"
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className={inputClass}
            required={isAdd}
            disabled={submitting}
          />
          {!isAdd && pkg?.image && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Current:{" "}
              <a
                href={pkg.image}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
              >
                view image
              </a>
            </p>
          )}
        </div>

        <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <legend className="px-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Outline itinerary
          </legend>
          {draft.itinerary.map((day, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50 sm:grid-cols-[140px_1fr_auto]"
            >
              <div>
                <label
                  htmlFor={`pkg-day-${index}`}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Day
                </label>
                <input
                  id={`pkg-day-${index}`}
                  className={inputClass}
                  value={day.dayNumber}
                  onChange={(e) =>
                    updateItinerary(index, "dayNumber", e.target.value)
                  }
                  placeholder="Day 01"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label
                  htmlFor={`pkg-desc-${index}`}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Description
                </label>
                <input
                  id={`pkg-desc-${index}`}
                  className={inputClass}
                  value={day.description}
                  onChange={(e) =>
                    updateItinerary(index, "description", e.target.value)
                  }
                  placeholder="Journey from Kathmandu to Dharan"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="flex items-end sm:justify-end">
                <DashboardButton
                  type="button"
                  onClick={() => removeItineraryDay(index)}
                  disabled={submitting || draft.itinerary.length <= 1}
                  variant="secondary"
                  size="sm"
                  icon={Trash2}
                >
                  Remove
                </DashboardButton>
              </div>
            </div>
          ))}
          <DashboardButton
            type="button"
            onClick={addItineraryDay}
            disabled={submitting}
            variant="primary"
            size="sm"
            icon={Plus}
          >
            Add day
          </DashboardButton>
        </fieldset>

        {renderListEditor({
          keyName: "tripHighlights",
          title: "Trip highlights",
          placeholder: "Scenic ride through eastern hills",
        })}

        {renderListEditor({
          keyName: "inclusions",
          title: "Inclusions",
          placeholder: "Hotel accommodation",
        })}

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <DashboardButton
            type="button"
            onClick={onClose}
            disabled={submitting}
            variant="secondary"
            icon={X}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="submit"
            disabled={submitting}
            variant="primary"
            icon={Save}
          >
            {submitting ? "Saving…" : isAdd ? "Add package" : "Save changes"}
          </DashboardButton>
        </div>
      </form>
    </Modal>
  );
}
