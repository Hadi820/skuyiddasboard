"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import {
  getAllStorTransactions,
  getStorBalance,
  getTotalDeposits,
  getTotalWithdrawals,
  addStorTransaction,
} from "@/services/stor-service"
import { ArrowDownCircle, ArrowUpCircle, Download, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function StorFundDashboard() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<any[]>([])
  const [balance, setBalance] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [totalWithdrawals, setTotalWithdrawals] = useState(0)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"deposit" | "withdrawal">("deposit")
  const [searchTerm, setSearchTerm] = useState("")
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allTransactions = getAllStorTransactions()
    setTransactions(allTransactions)
    setBalance(getStorBalance())
    setTotalDeposits(getTotalDeposits())
    setTotalWithdrawals(getTotalWithdrawals())
  }

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi semua field yang diperlukan.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(newTransaction.amount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Validasi Gagal",
        description: "Jumlah harus berupa angka positif.",
        variant: "destructive",
      })
      return
    }

    // Validasi saldo cukup untuk penarikan
    if (transactionType === "withdrawal" && amount > balance) {
      toast({
        title: "Saldo Tidak Cukup",
        description: "Jumlah penarikan melebihi saldo yang tersedia.",
        variant: "destructive",
      })
      return
    }

    addStorTransaction({
      amount,
      type: transactionType,
      description: newTransaction.description,
      date: new Date().toISOString(),
      createdBy: "admin", // Hardcoded for now, should be from auth context
    })

    toast({
      title: "Transaksi Berhasil",
      description: `${transactionType === "deposit" ? "Setoran" : "Penarikan"} sebesar Rp ${amount.toLocaleString()} telah berhasil dicatat.`,
    })

    setNewTransaction({
      amount: "",
      description: "",
    })
    setIsAddDialogOpen(false)
    loadData()
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Harga Stor</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setTransactionType("deposit")
              setIsAddDialogOpen(true)
            }}
          >
            <ArrowDownCircle className="h-4 w-4 mr-2" />
            Tambah Setoran
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setTransactionType("withdrawal")
              setIsAddDialogOpen(true)
            }}
          >
            <ArrowUpCircle className="h-4 w-4 mr-2" />
            Tambah Penarikan
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Ekspor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saldo Harga Stor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {balance.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Setoran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {totalDeposits.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Penarikan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rp {totalWithdrawals.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Riwayat Transaksi</CardTitle>
              <CardDescription>Riwayat setoran dan penarikan Harga Stor</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Cari transaksi..."
                className="pl-8 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="deposits">Setoran</TabsTrigger>
              <TabsTrigger value="withdrawals">Penarikan</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                        Jumlah
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{transaction.id}</td>
                          <td className="px-4 py-3">
                            {format(parseISO(transaction.date), "dd MMM yyyy HH:mm", { locale: id })}
                          </td>
                          <td className="px-4 py-3">{transaction.description}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                                transaction.type === "deposit"
                                  ? "bg-[#dcfce7] text-[#166534]"
                                  : "bg-[#fee2e2] text-[#991b1b]"
                              }`}
                            >
                              {transaction.type === "deposit" ? (
                                <>
                                  <ArrowDownCircle className="h-3 w-3 mr-1" />
                                  Setoran
                                </>
                              ) : (
                                <>
                                  <ArrowUpCircle className="h-3 w-3 mr-1" />
                                  Penarikan
                                </>
                              )}
                            </span>
                          </td>
                          <td
                            className={`px-4 py-3 font-medium text-right ${
                              transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "deposit" ? "+" : "-"}Rp {transaction.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          Tidak ada transaksi yang ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="deposits">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                        Jumlah
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions
                      .filter((transaction) => transaction.type === "deposit")
                      .map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{transaction.id}</td>
                          <td className="px-4 py-3">
                            {format(parseISO(transaction.date), "dd MMM yyyy HH:mm", { locale: id })}
                          </td>
                          <td className="px-4 py-3">{transaction.description}</td>
                          <td className="px-4 py-3 font-medium text-right text-green-600">
                            +Rp {transaction.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="withdrawals">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                        Jumlah
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions
                      .filter((transaction) => transaction.type === "withdrawal")
                      .map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{transaction.id}</td>
                          <td className="px-4 py-3">
                            {format(parseISO(transaction.date), "dd MMM yyyy HH:mm", { locale: id })}
                          </td>
                          <td className="px-4 py-3">{transaction.description}</td>
                          <td className="px-4 py-3 font-medium text-right text-red-600">
                            -Rp {transaction.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transactionType === "deposit" ? "Tambah Setoran" : "Tambah Penarikan"} Harga Stor
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">Rp</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  className="pl-10"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Masukkan deskripsi transaksi"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddTransaction}>
              {transactionType === "deposit" ? "Tambah Setoran" : "Tambah Penarikan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
