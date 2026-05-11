import { getReports, deleteReport, updateReportStatus } from "@/app/actions/post-actions"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function AdminReportsPage() {
  const reports = await getReports()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">សេចក្តីរាយការណ៍ (Reports)</h1>
          <p className="text-muted-foreground">គ្រប់គ្រងការរាយការណ៍ពីអ្នកប្រើប្រាស់លើអត្ថបទនានា។</p>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>កាលបរិច្ឆេទ</TableHead>
              <TableHead>អត្ថបទ (Post)</TableHead>
              <TableHead>មូលហេតុ (Reason)</TableHead>
              <TableHead>ស្ថានភាព</TableHead>
              <TableHead className="text-right">សកម្មភាព</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                  មិនមានសេចក្តីរាយការណ៍នៅឡើយទេ។
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="text-xs">
                    {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <div className="flex flex-col">
                      <span className="font-medium truncate">{report.post.title}</span>
                      <Link 
                        href={`/news/${report.post.slug}`} 
                        target="_blank"
                        className="text-[10px] text-primary flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="size-2" /> មើលអត្ថបទ
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm italic">
                    "{report.reason}"
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={report.status === 'pending' ? 'destructive' : 'secondary'}
                      className="text-[10px]"
                    >
                      {report.status === 'pending' ? 'រង់ចាំ' : 'បានពិនិត្យ'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <form action={async () => {
                        'use server'
                        await updateReportStatus(report.id, 'reviewed')
                      }}>
                        <Button variant="ghost" size="icon" className="size-8 text-green-600">
                          <CheckCircle className="size-4" />
                        </Button>
                      </form>
                      <form action={async () => {
                        'use server'
                        await deleteReport(report.id)
                      }}>
                        <Button variant="ghost" size="icon" className="size-8 text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
