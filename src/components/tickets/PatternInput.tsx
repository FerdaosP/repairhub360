import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { PatternModal } from "./PatternModal";

export function PatternInput({ form }: { form: any }) {
  const [showPatternModal, setShowPatternModal] = useState(false);

  const handlePatternSelect = (pattern: string) => {
    form.setValue("pattern", pattern);
    setShowPatternModal(false);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="use_pattern"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Use Pattern</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch("use_pattern") ? (
        <>
          <FormField
            control={form.control}
            name="pattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pattern</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input {...field} readOnly placeholder="Click to set pattern" />
                    <Button type="button" onClick={() => setShowPatternModal(true)}>
                      Set Pattern
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {showPatternModal && (
            <PatternModal
              isOpen={showPatternModal}
              onClose={() => setShowPatternModal(false)}
              onPatternSelect={handlePatternSelect}
            />
          )}
        </>
      ) : (
        <FormField
          control={form.control}
          name="access_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter access code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="sim_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SIM Code (Optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter SIM code" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}