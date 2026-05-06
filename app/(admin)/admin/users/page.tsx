import { getUsers } from "@/app/actions/user-actions"
import { UserForm } from "@/components/admin/user-form"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserDeleteButton } from "@/components/admin/user-delete-button"
import { UserEditDialog } from "@/components/admin/user-edit-dialog"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-bold font-heading">គ្រប់គ្រងអ្នកប្រើប្រាស់</h1>
        <p className="text-sm text-muted-foreground mt-1">បន្ថែម និងគ្រប់គ្រងអ្នកនិពន្ធ ឬបុគ្គលិក</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>បន្ថែមអ្នកប្រើប្រាស់ថ្មី</CardTitle>
              <CardDescription>បញ្ចូលព័ត៌មាន និងរូបភាពផ្ទាល់ខ្លួន</CardDescription>
            </CardHeader>
            <CardContent>
              <UserForm />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>បញ្ជីអ្នកប្រើប្រាស់</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>រូបភាព</TableHead>
                    <TableHead>ឈ្មោះ</TableHead>
                    <TableHead>អ៊ីមែល</TableHead>
                    <TableHead>អត្ថបទ</TableHead>
                    <TableHead className="text-right">សកម្មភាព</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={user.image || ''} />
                          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>{user._count.posts}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <UserEditDialog user={user} />
                          <UserDeleteButton id={user.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        មិនទាន់មានអ្នកប្រើប្រាស់នៅឡើយទេ
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
