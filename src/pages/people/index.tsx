import authRoute from 'src/authentication/authRoute'
import React, { useEffect, useState } from 'react'
import { getOrganizationMembersForPeople } from '@/apis/people'
import { userSignUpDecisionHub, attachMember, userCheck, removeMemberApi } from '@/apis/people'
import { changePeopleRole } from '@/apis/all-people'
// @ts-ignore: No types for papaparse
import Papa from 'papaparse'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/components/ui/dialog';
import { Button } from '@/components/components/ui/button';
import { Typography } from '@/components/components/ui/typography';
import { Badge } from '@/components/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { WizerTeamIcon } from '@/components/icons'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/components/ui/pagination';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/components/ui/select';
import Loading from '@/components/loading'

type UserProfileType = {
    username: string
    id: number
}

type MemberType = {
    organization_member_id: number
    user: number
    username: string
    email: string
    teamDetails: { teamName: string }[] | null
    organizationId: number
    organization_member_role: string
    organization_member_status: string
    decisionProfileComplete: boolean
    decisionProfileType: string
}

type Props = {
    userProfile: UserProfileType // Use the defined UserProfileType
    user: any
}

const People: React.FC<any> = (props) => {

    const navigate = useNavigate();
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }
    const columns = ['Username', 'email', 'Group', 'Role', 'Status', 'Profile', 'Decision', 'Actions']
    const [members, setMembers] = useState<MemberType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [severity, setSeverity] = useState<string>('success')

    const handleOpenDialog = (member: MemberType) => {
        setSelectedMember(member);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedMember(null);
    };

    const handleConfirmRemove = () => {
        if (selectedMember) {
            removeMember(selectedMember.user, selectedMember.organizationId);
            handleCloseDialog();
        }
    };

    const removeMember = (user: number, orgId: number) => {
        removeMemberApi(user, orgId)
            .then(() => {
                setMembers(prevMembers => prevMembers.filter(member => member.user !== user));
                toast.success('Member removed successfully.')
            })
            .catch(error => {
                toast.error('Failed to remove member.')
            });
    };

    const orgId = props.user.small_decision.organization_id

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            const file = files[0];
            if (file) {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: async (results: any) => {
                        if (results.errors.length > 0) {
                            toast.error('File is empty')
                            return
                        }
                        const expectedColumns = ['firstName', 'lastName', 'email', 'role'];
                        const actualColumns = Object.keys(results.data[0]);
                        const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
                        if (missingColumns.length > 0) {
                            toast.error('Missing columns in CSV file:' + String(missingColumns))
                            return
                        }
                        let count = 0
                        const csvCount = results.data.length
                        const apiCallPromises = results.data.map(async (person: any) => {
                            const userName = person.firstName + '_' + person.lastName
                            const userExists = await userCheck(person.email)
                            if (userExists) {
                                const res = await attachMember('external', Number(userExists), Number(orgId))
                                if (res && res.id) {
                                    count += 1
                                }
                            } else {
                                const res = await userSignUpDecisionHub(
                                    person.email,
                                    userName,
                                    Number(props.userProfile.id),
                                    Number(orgId),
                                    person.role
                                )
                                if (res && res.user && res.user.id) {
                                    count += 1
                                }
                            }
                        })
                        await Promise.all(apiCallPromises)
                        toast.success(count + ' People added successfully from ' + csvCount)
                    },
                    error: (error: any) => {
                        toast.error(error)
                    }
                })
            }
        } catch (error) {
            console.error('Error in handleFileChange:', error);
        }
    }

    const fetchAllMembers = async () => {
        setLoading(true)
        try {
            const res = await getOrganizationMembersForPeople(Number(orgId))
            if (res && res.length > 0) {
                setMembers(res)
            }
        } catch (error) {
            toast.error('Failed to load members.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllMembers()
    }, [])

    const handleAddPeople = () => {
        navigate({
            pathname: '/people/add-new-person',
            search: `?organization_id=${props.user.small_decision.organization_id}&userId=${props.userProfile.id}`
        });
    }

    const handleUploadCsvClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '' // reset so same file can be selected again
            fileInputRef.current.click();
        }
    }

    const handleSelectRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const handleRoleChange = async (event: any, orgId: number, userId: number) => {
        const newRole = event.target.value as string
        try {
            const result = await changePeopleRole({
                organizationId: orgId,
                newRole: newRole,
                userId: userId
            })
            if (result) {
                fetchAllMembers()
                toast.success('User role has been updated successfully.')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (column: string) => {
        if (sortColumn !== column) return (
            <svg className="ml-1 w-3 h-3 opacity-30" viewBox="0 0 20 20"><path d="M7 10l3 3 3-3" stroke="#3D3D3D" strokeWidth="1.5" fill="none" /></svg>
        );
        return sortDirection === 'asc' ? (
            <svg className="ml-1 w-3 h-3" viewBox="0 0 20 20"><path d="M7 10l3-3 3 3" stroke="#3D3D3D" strokeWidth="1.5" fill="none" /></svg>
        ) : (
            <svg className="ml-1 w-3 h-3" viewBox="0 0 20 20"><path d="M7 10l3 3 3-3" stroke="#3D3D3D" strokeWidth="1.5" fill="none" /></svg>
        );
    };

    const getSortableKey = (col: string, member: MemberType) => {
        switch (col) {
            case 'Username': return member.username?.toLowerCase() || '';
            case 'email': return member.email?.toLowerCase() || '';
            case 'Role': return member.organization_member_role || '';
            case 'Status': return member.organization_member_status || '';
            case 'Profile': return member.decisionProfileComplete ? 'Completed' : 'Pending';
            default: return '';
        }
    };

    const sortedMembers = React.useMemo(() => {
        if (!sortColumn) return members;
        const col = sortColumn;
        return [...members].sort((a, b) => {
            const aKey = getSortableKey(col, a);
            const bKey = getSortableKey(col, b);
            if (aKey < bKey) return sortDirection === 'asc' ? -1 : 1;
            if (aKey > bKey) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [members, sortColumn, sortDirection]);

    return (
        <div className="!h-screen p-[30px] flex flex-col gap-8">
            <div className="flex items-center justify-between flex-none">
                <div className='flex items-center justify-center'>
                    <div className='mr-3 text-primary'>
                        <WizerTeamIcon size={32} style={{ width: '32px', height: '32px' }} />
                    </div>
                    <Typography className="flex items-center text-4xl font-bold">
                        All People ({members.length})
                    </Typography>
                </div>
                <div className='flex items-center gap-2'>
                    <div className="relative group">
                        <Button variant="secondary" onClick={handleUploadCsvClick} className="mr-2">
                            Upload CSV File
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-white border rounded shadow text-xs hidden group-hover:block z-10">
                            To upload a CSV file you need the following columns:<br />
                            <span className="font-mono">firstName<br />lastName<br />email<br />role - one of user,admin,external</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button className='rounded-4xl' onClick={handleAddPeople}>
                            Add new person
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="flex flex-col">
                    {loading ? (
                        <Loading />
                    ) : (<>
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <Table>
                                <TableHeader className="bg-gray-100">
                                    <TableRow>
                                        {columns.map((col, index) => {
                                            const sortable = ['Username', 'email', 'Role', 'Status', 'Profile'].includes(col);
                                            return (
                                                <TableHead
                                                    key={index}
                                                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b cursor-pointer select-none"
                                                    onClick={sortable ? () => handleSort(col) : undefined}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        {col}
                                                        {sortable && getSortIcon(col)}
                                                    </div>
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member, index) => (
                                        <TableRow key={index} className="hover:bg-gray-50">
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.username}</TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 lowercase">{member.email}</TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                                                {member.teamDetails === null ? (
                                                    <Badge variant="secondary">Unassigned</Badge>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1">
                                                        {member.teamDetails.map((teamDetail, idx) => (
                                                            <Badge key={idx} variant="outline">{teamDetail.teamName}</Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                                                <select
                                                    className="border rounded px-2 py-1 text-sm"
                                                    value={member.organization_member_role}
                                                    onChange={(event) => handleRoleChange(event, member.organizationId, member.user)}
                                                >
                                                    <option value='admin'>Admin</option>
                                                    <option value='user'>User</option>
                                                    <option value='external'>External</option>
                                                </select>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-3 py-1 rounded text-xs font-semibold ${member.organization_member_status === 'created' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'}`}>
                                                    {member.organization_member_status === 'created' ? 'created' : 'registered'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Badge variant={member.decisionProfileComplete ? 'default' : 'secondary'}>
                                                    {member.decisionProfileComplete ? 'Completed' : 'Pending'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                {member.decisionProfileType && (
                                                    <img src={`/images/decision-profile/${member.decisionProfileType}.png`} alt='pen' width={80} height={80} className="mx-auto" />
                                                )}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <Button variant="destructive" size="icon" onClick={() => handleOpenDialog(member)}>
                                                    <svg width={20} height={20} fill="none" viewBox="0 0 20 20"><path d="M6 8v6m4-6v6m-7 2V6a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Pagination */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border-t bg-gray-50 gap-2">
                            <div className="text-sm text-black">
                                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, members.length)} of {members.length} results
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setPage(page - 1)}
                                                aria-disabled={page === 0}
                                                tabIndex={page === 0 ? -1 : 0}
                                                className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>
                                        {Array.from({ length: Math.ceil(members.length / rowsPerPage) }, (_, i) => (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    isActive={i === page}
                                                    onClick={() => setPage(i)}
                                                    className="text-black"
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => setPage(page + 1)}
                                                aria-disabled={(page + 1) * rowsPerPage >= members.length}
                                                tabIndex={(page + 1) * rowsPerPage >= members.length ? -1 : 0}
                                                className={(page + 1) * rowsPerPage >= members.length ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                                <Select value={String(rowsPerPage)} onValueChange={v => { setRowsPerPage(Number(v)); setPage(0); }}>
                                    <SelectTrigger className="ml-2 text-black bg-white border rounded px-2 py-1 text-sm w-24">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[10, 25, 100].map(opt => (
                                            <SelectItem key={opt} value={String(opt)} className="text-black">{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </>
                    )}
                </div>
                {/* Dialog */}
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to remove this member?</DialogTitle>
                        </DialogHeader>8
                        <div className="py-2">
                            <Typography variant="body2">
                                {selectedMember ? `Username: ${selectedMember.username}, Email: ${selectedMember.email}` : ''}
                            </Typography>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                            <Button variant="destructive" onClick={handleConfirmRemove}>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default authRoute(People)
