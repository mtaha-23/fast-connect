"use client"



import { useEffect, useMemo, useState } from "react"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useAuth } from "@/lib/hooks/use-auth"

import { getAuthHeaders } from "@/lib/utils/test-api"

import type { SectionKey } from "@/lib/types/test.types"

import { FULL_TEST_SECTIONS } from "@/lib/types/test.types"

import { Loader2 } from "lucide-react"



type ImportSection = SectionKey | "all"



type ImportResult = {

  uploaded: number

  perSection: Record<SectionKey, number>

  errors?: string[]

  message?: string

}



type BankCounts = Record<SectionKey, { inFile: number }>



export default function QuestionImportPage() {

  const router = useRouter()

  const { user, userData } = useAuth()



  const [selection, setSelection] = useState<ImportSection>("all")

  const [loading, setLoading] = useState(false)

  const [loadingCounts, setLoadingCounts] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [result, setResult] = useState<ImportResult | null>(null)

  const [bankCounts, setBankCounts] = useState<BankCounts | null>(null)



  const canImport = useMemo(() => user && userData?.role === "admin", [user, userData?.role])



  const sectionsToImport = useMemo(() => {

    return selection === "all" ? [...FULL_TEST_SECTIONS] : [selection]

  }, [selection])



  useEffect(() => {

    if (!canImport) return



    const loadCounts = async () => {

      setLoadingCounts(true)

      try {

        const headers = await getAuthHeaders()

        const response = await fetch("/api/admin/questions/import", { headers })

        const data = (await response.json()) as { counts?: BankCounts; error?: string }

        if (response.ok && data.counts) {

          setBankCounts(data.counts)

        }

      } catch {

        // Non-blocking — counts are informational only.

      } finally {

        setLoadingCounts(false)

      }

    }



    void loadCounts()

  }, [canImport])



  const runImport = async () => {

    if (!user) {

      setError("You must be signed in.")

      return

    }

    if (!canImport) {

      setError("Admin access required.")

      return

    }



    setLoading(true)

    setError(null)

    setResult(null)

    try {

      const headers = await getAuthHeaders()

      const response = await fetch("/api/admin/questions/import", {

        method: "POST",

        headers,

        body: JSON.stringify({ sections: sectionsToImport }),

      })



      const data = (await response.json()) as ImportResult & { error?: string }

      if (!response.ok) {

        throw new Error(data.error || "Import failed.")

      }



      setResult(data)

    } catch (e) {

      setError(e instanceof Error ? e.message : "Import failed.")

    } finally {

      setLoading(false)

    }

  }



  return (

    <div className="min-h-screen bg-background">

      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">

        <div className="flex items-center justify-between h-16 px-6">

          <div>

            <h1 className="text-xl font-semibold text-foreground">Question Import</h1>

            <p className="text-sm text-muted-foreground">

              Imports local JSON banks into Firestore via server API (full file read — all approved questions).

            </p>

          </div>

          <Button variant="outline" onClick={() => router.push("/admin")} disabled={loading}>

            Back to Admin

          </Button>

        </div>

      </header>



      <div className="p-6 max-w-3xl space-y-4">

        <Card>

          <CardHeader>

            <CardTitle>Local question bank</CardTitle>

            <CardDescription>
              Approved questions in each bank file (legacy section values like `mathematics` are normalized automatically).
            </CardDescription>

          </CardHeader>

          <CardContent>

            {loadingCounts ? (

              <div className="text-sm text-muted-foreground flex items-center gap-2">

                <Loader2 className="w-4 h-4 animate-spin" />

                Reading local banks...

              </div>

            ) : bankCounts ? (

              <div className="grid grid-cols-2 gap-2 text-sm">

                <div>Advanced Maths: {bankCounts.advanced_maths.inFile}</div>

                <div>Basic Maths: {bankCounts.basic_maths.inFile}</div>

                <div>IQ: {bankCounts.iq.inFile}</div>

                <div>English: {bankCounts.english.inFile}</div>

              </div>

            ) : (

              <div className="text-sm text-muted-foreground">Sign in as admin to view counts.</div>

            )}

          </CardContent>

        </Card>



        <Card>

          <CardHeader>

            <CardTitle>Import settings</CardTitle>

            <CardDescription>

              Server-side import reads the full JSON files from disk and uploads in batches of 450. Re-importing

              overwrites documents with the same id (merge).

            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-4">

            <div className="space-y-2">

              <div className="text-sm font-medium">Section</div>

              <Select value={selection} onValueChange={(v) => setSelection(v as ImportSection)}>

                <SelectTrigger className="w-full sm:w-[320px]">

                  <SelectValue placeholder="Select section" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">All sections</SelectItem>

                  <SelectItem value="advanced_maths">Advanced Maths</SelectItem>

                  <SelectItem value="basic_maths">Basic Maths</SelectItem>

                  <SelectItem value="iq">IQ</SelectItem>

                  <SelectItem value="english">English</SelectItem>

                </SelectContent>

              </Select>

            </div>



            <Button onClick={runImport} disabled={!canImport || loading}>

              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}

              Import to Firestore

            </Button>



            {!canImport ? (

              <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm">

                You must be logged in as an admin to import.

              </div>

            ) : null}



            {error ? (

              <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm">

                {error}

              </div>

            ) : null}



            {result ? (

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 px-4 py-3 text-sm space-y-2">

                <div className="font-medium">{result.message ?? "Import completed"}</div>

                <div>Uploaded: {result.uploaded}</div>

                <div className="grid grid-cols-2 gap-2">

                  <div>Advanced: {result.perSection.advanced_maths}</div>

                  <div>Basic: {result.perSection.basic_maths}</div>

                  <div>IQ: {result.perSection.iq}</div>

                  <div>English: {result.perSection.english}</div>

                </div>

                {result.errors?.length ? (

                  <div className="text-destructive space-y-1 pt-2">

                    {result.errors.map((entry) => (

                      <div key={entry}>{entry}</div>

                    ))}

                  </div>

                ) : null}

              </div>

            ) : null}

          </CardContent>

        </Card>

      </div>

    </div>

  )

}


