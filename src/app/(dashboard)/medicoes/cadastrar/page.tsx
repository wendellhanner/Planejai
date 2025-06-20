"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronLeft, Save, Trash, Plus, Upload, XCircle, ImageIcon, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Definição do esquema do formulário de medição
const medicaoFormSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  measurementDate: z.string().min(1, { message: "A data é obrigatória" }),
  leadId: z.string().min(1, { message: "Selecione um cliente" }),
  rooms: z.array(
    z.object({
      roomName: z.string().min(1, { message: "Nome do ambiente é obrigatório" }),
      width: z.coerce.number().min(0.1, { message: "Largura inválida" }),
      height: z.coerce.number().min(0.1, { message: "Altura inválida" }),
      depth: z.coerce.number().min(0.1, { message: "Profundidade inválida" }),
      observations: z.string().optional(),
    })
  ).min(1, { message: "Adicione pelo menos um ambiente" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof medicaoFormSchema>;

// Dados mockados de leads (clientes) para o select
const mockLeads = [
  { id: "1", name: "João Silva" },
  { id: "2", name: "Maria Oliveira" },
  { id: "3", name: "Carlos Santos" },
  { id: "4", name: "Ana Beatriz" },
  { id: "5", name: "Fernando Pereira" },
];

// Componente de upload de arquivos
function FileUploader({ onAddFile }: { onAddFile: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onAddFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onAddFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`flex flex-col items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-zinc-400 focus:outline-none ${
          dragActive ? "border-zinc-500 bg-zinc-50" : "border-zinc-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <span className="flex items-center space-x-2">
          <Upload className="w-6 h-6 text-zinc-500" />
          <span className="font-medium text-zinc-600">
            Arraste arquivos aqui ou clique para fazer upload
          </span>
        </span>
        <span className="text-xs text-zinc-500 mt-2">
          Suporta JPG, PNG, PDF até 10MB
        </span>
        <input
          type="file"
          className="hidden"
          onChange={handleChange}
          accept="image/png, image/jpeg, application/pdf"
        />
      </div>
    </div>
  );
}

// Componente de visualização de arquivo
function FilePreview({
  file,
  onRemove
}: {
  file: File,
  onRemove: () => void
}) {
  const isImage = file.type.startsWith('image/');
  const fileIcon = isImage ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />;

  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-zinc-50">
      <div className="flex items-center gap-3">
        {isImage && previewUrl ? (
          <div className="h-10 w-10 rounded-md overflow-hidden">
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-md bg-zinc-200 flex items-center justify-center">
            {fileIcon}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
          <span className="text-xs text-zinc-500">{(file.size / 1024).toFixed(0)} KB</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-zinc-500 hover:text-red-500"
      >
        <XCircle className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function MedicoesFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Inicialização do formulário com valores padrão
  const form = useForm<FormValues>({
    resolver: zodResolver(medicaoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      measurementDate: new Date().toISOString().split('T')[0],
      leadId: "",
      rooms: [
        { roomName: "", width: 0, height: 0, depth: 0, observations: "" }
      ],
      notes: "",
    },
  });

  // Função para adicionar um novo ambiente ao formulário
  const addRoom = () => {
    const currentRooms = form.getValues("rooms");
    form.setValue("rooms", [
      ...currentRooms,
      { roomName: "", width: 0, height: 0, depth: 0, observations: "" }
    ]);
  };

  // Função para remover um ambiente do formulário
  const removeRoom = (index: number) => {
    const currentRooms = form.getValues("rooms");
    if (currentRooms.length > 1) {
      form.setValue(
        "rooms",
        currentRooms.filter((_, i) => i !== index)
      );
    } else {
      toast.error("É necessário ter ao menos um ambiente");
    }
  };

  // Função para adicionar arquivo de foto
  const addPhoto = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("O arquivo deve ser uma imagem (JPG ou PNG)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error("A imagem não pode ter mais de 10MB");
      return;
    }

    setUploadedPhotos([...uploadedPhotos, file]);
    toast.success(`Foto "${file.name}" adicionada`);
  };

  // Função para adicionar arquivos (PDF, CAD, etc)
  const addFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error("O arquivo não pode ter mais de 10MB");
      return;
    }

    setUploadedFiles([...uploadedFiles, file]);
    toast.success(`Arquivo "${file.name}" adicionado`);
  };

  // Função para remover uma foto
  const removePhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  // Função para remover um arquivo
  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // Função para preencher o formulário com dados de exemplo
  const preencherExemplo = () => {
    form.setValue("title", "Medição Apartamento 302");
    form.setValue("description", "Medição para projeto de móveis planejados no apartamento novo");
    form.setValue("leadId", "2"); // Maria Oliveira
    form.setValue("rooms", [
      {
        roomName: "Cozinha",
        width: 3.5,
        height: 2.8,
        depth: 6.2,
        observations: "Espaço para geladeira e fogão já existentes"
      },
      {
        roomName: "Quarto Casal",
        width: 4.2,
        height: 2.7,
        depth: 3.8,
        observations: "Cliente deseja armário com portas de correr"
      },
      {
        roomName: "Home Office",
        width: 2.8,
        height: 2.7,
        depth: 2.5,
        observations: "Espaço para duas estações de trabalho"
      }
    ]);
    form.setValue("notes", "Cliente tem pressa para receber orçamento. Priorizar cozinha.");

    toast.info("Formulário preenchido com dados de exemplo!");
  };

  // Função de envio do formulário
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      // Aqui seria a integração com a API para enviar os dados e arquivos
      console.log("Dados do formulário:", data);
      console.log("Fotos:", uploadedPhotos);
      console.log("Arquivos:", uploadedFiles);

      // Simulando um atraso da API
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success("Medição cadastrada com sucesso!");
      router.push("/medicoes");
    } catch (error) {
      toast.error("Erro ao cadastrar medição. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={preencherExemplo}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Preencher Exemplo
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader>
          <CardTitle>Cadastro de Medição</CardTitle>
          <CardDescription>
            Registre medições para criação de projetos de móveis planejados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="info">Informações Gerais</TabsTrigger>
              <TabsTrigger value="rooms">Ambientes</TabsTrigger>
              <TabsTrigger value="files">Fotos e Arquivos</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="info" className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título da Medição*</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Medição Apartamento João" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="measurementDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Medição*</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leadId"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Cliente*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um cliente" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockLeads.map((lead) => (
                                <SelectItem key={lead.id} value={lead.id}>
                                  {lead.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o propósito desta medição"
                              className="resize-none min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="rooms" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Ambientes</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRoom}
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar Ambiente
                    </Button>
                  </div>

                  {form.getValues("rooms").map((_, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-md bg-zinc-50">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Ambiente {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRoom(index)}
                          className="h-8 w-8 p-0 text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`rooms.${index}.roomName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Ambiente*</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Cozinha, Quarto, Sala..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name={`rooms.${index}.width`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Largura (m)*</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 3.5"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`rooms.${index}.height`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Altura (m)*</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 2.7"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`rooms.${index}.depth`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Profundidade (m)*</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 5.0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`rooms.${index}.observations`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Observações</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Detalhes específicos deste ambiente"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="files" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Fotos da Medição</h3>
                      <p className="text-sm text-zinc-500 mb-4">
                        Adicione fotos dos ambientes medidos para referência
                      </p>

                      <FileUploader onAddFile={addPhoto} />

                      {uploadedPhotos.length > 0 && (
                        <div className="mt-4 grid gap-2 md:grid-cols-2">
                          {uploadedPhotos.map((photo, index) => (
                            <FilePreview
                              key={index}
                              file={photo}
                              onRemove={() => removePhoto(index)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">Documentos Anexos</h3>
                      <p className="text-sm text-zinc-500 mb-4">
                        Anexe plantas, croquis ou outros documentos relevantes
                      </p>

                      <FileUploader onAddFile={addFile} />

                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 grid gap-2 md:grid-cols-2">
                          {uploadedFiles.map((file, index) => (
                            <FilePreview
                              key={index}
                              file={file}
                              onRemove={() => removeFile(index)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações Gerais</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Informações adicionais sobre a medição"
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <CardFooter className="flex justify-between px-0 pt-6 border-t">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push("/medicoes")}
                    className="gap-1"
                  >
                    <Trash className="h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-1"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Salvando..." : "Salvar Medição"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
