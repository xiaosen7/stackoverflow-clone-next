import { profileActions, userActions } from "@/actions";
import { SearchUtil, prisma } from "@/prisma";
import {
  ProfileAnsweredQuestionCard,
  ProfileBase,
  ProfileStats,
  ProfileTopQuestionCard,
} from "@/profile";
import { ESearchParamKey } from "@/search-params";
import {
  IPageProps,
  PagePagination,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared";
import React from "react";

const ProFileDetailPage: React.FC<IPageProps<{ id: string }>> = async ({
  params: { id },
  searchParams,
}) => {
  const questionSearchUtil = SearchUtil.create(SearchUtil.kind.Question, {
    page: searchParams[ESearchParamKey.QuestionPage],
  });
  const answerSearchUtil = SearchUtil.create(SearchUtil.kind.Answer, {
    page: searchParams[ESearchParamKey.AnsweredQuestionPage],
  });
  const [
    [profileUser, badges],
    [questions, questionCount],
    [answers, answerCount],
    loggedUser,
  ] = await Promise.all([
    prisma.$transaction(async () =>
      Promise.all([
        prisma.user.findUniqueOrThrow({
          where: {
            id,
          },
        }),
        profileActions.getBadges(id),
      ])
    ),
    prisma.$transaction([
      prisma.question.findMany({
        ...questionSearchUtil.args,
        where: {
          authorId: id,
        },
        include: {
          tags: true,
          upvotes: true,
        },
      }),
      prisma.question.count({
        where: {
          authorId: id,
        },
      }),
    ]),
    prisma.$transaction([
      prisma.answer.findMany({
        ...answerSearchUtil.args,
        where: {
          authorId: id,
        },
        include: {
          question: {
            include: {
              author: true,
            },
          },
          upvotes: true,
        },
      }),
      prisma.answer.count({
        where: {
          authorId: id,
        },
      }),
    ]),
    userActions.getCurrent(),
  ]);

  const editable = loggedUser?.id === profileUser.id;

  return (
    <div>
      <ProfileBase editable={editable} user={profileUser} />
      <ProfileStats
        badges={badges}
        reputation={0}
        totalAnswers={answerCount}
        totalQuestions={questionCount}
      />

      <div className="mt-10 flex gap-10">
        <Tabs className="flex-1" defaultValue="top-posts">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger className="tab" value="top-posts">
              Top Posts
            </TabsTrigger>
            <TabsTrigger className="tab" value="answers">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent className="flex w-full flex-col gap-6" value="top-posts">
            {questions.map((question) => (
              <ProfileTopQuestionCard
                key={question.id}
                question={question}
                tags={question.tags}
                user={profileUser}
                votes={question.upvotes.length}
              />
            ))}
            <PagePagination
              searchParamKey={ESearchParamKey.QuestionPage}
              total={questionCount}
            />
          </TabsContent>
          <TabsContent className="flex w-full flex-col gap-6" value="answers">
            {answers.map((answer) => (
              <ProfileAnsweredQuestionCard
                key={answer.id}
                answer={answer}
                editable={editable}
                question={answer.question}
                upVotes={answer.upvotes.length}
                user={answer.question.author}
              />
            ))}
            <PagePagination
              searchParamKey={ESearchParamKey.AnsweredQuestionPage}
              total={answerCount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProFileDetailPage;
